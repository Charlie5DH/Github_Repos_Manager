import time
import logging
import csv
from io import StringIO
from sqlalchemy.orm import Session
import pika

from app.db.database import SessionLocal, engine
from app.models.repository import Base, Repository
from app.config.config import RABBITMQ_URL

QUEUE_NAME = "repos_import_queue"

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s - %(message)s"
)
logger = logging.getLogger(__name__)


def main():
    """
    Entry point for the worker. In a production environment, you might
    run this in a separate container via:
    `python -m app.workers.importer`.
    """
    # Ensure DB schema is up to date
    Base.metadata.create_all(bind=engine)

    while True:
        try:
            logger.info("Attempting to connect to RabbitMQ...")
            connection = pika.BlockingConnection(pika.URLParameters(RABBITMQ_URL))
            channel = connection.channel()

            # Ensure queue exists and set prefetch for fair dispatch
            channel.queue_declare(queue=QUEUE_NAME, durable=True)
            channel.basic_qos(prefetch_count=1)

            logger.info(f"Connected to RabbitMQ. Listening on queue '{QUEUE_NAME}'...")

            # Start consuming messages
            channel.basic_consume(
                queue=QUEUE_NAME,
                on_message_callback=on_message_callback
            )
            channel.start_consuming()

        except pika.exceptions.AMQPConnectionError as e:
            logger.error("Connection to RabbitMQ failed. Retrying in 5 seconds...")
            time.sleep(5)
        except KeyboardInterrupt:
            logger.warning("Worker interrupted by user. Shutting down gracefully...")
            try:
                channel.stop_consuming()
                connection.close()
            except Exception:
                pass
            break
        except Exception as e:
            logger.exception("Unexpected error in worker main loop: %s", e)
            time.sleep(5)

# pylint: disable=unused-argument
def on_message_callback(ch, method, properties, body):
    """
    Callback function for processing messages from the RabbitMQ queue.
    Includes try/except logic to properly ACK/NACK messages.
    """
    logger.info("Received a message from the queue.")
    try:
        # The message body is assumed to be CSV text
        package = body.decode("utf-8")
        logger.info('Processing package: %s', package)
        process_csv_data(package)

        # If everything succeeded, acknowledge the message
        ch.basic_ack(delivery_tag=method.delivery_tag)
        logger.info("Message processed and acknowledged.")

    except Exception as exc:
        # On error, log and decide whether to requeue or discard
        logger.exception("Error processing message: %s", exc)

        # In many use cases, you might discard the message or
        # dead-letter it instead of requeuing indefinitely.
        # For example:
        ch.basic_nack(delivery_tag=method.delivery_tag, requeue=False)


def process_csv_data(csv_data: str):
    """
    Parses CSV, inserts data into MariaDB. On any error, raise an exception.
    """
    f = StringIO(csv_data)
    reader = csv.DictReader(f)

    db: Session = SessionLocal()
    try:
        for row in reader:
            repo = Repository(
                name=row.get("name"),
                owner=row.get("owner"),
                stars_count=int(row.get("stars", "0"))
            )
            db.add(repo)
        db.commit()
        logger.info("CSV data successfully inserted into the database.")
    except Exception as e:
        db.rollback()
        logger.error("Failed to insert CSV data into database: %s", e)
        raise
    finally:
        db.close()


if __name__ == "__main__":
    main()