import json
import time
import logging
import requests
import pika

from sqlalchemy.orm import Session

from app.db.database import SessionLocal, engine
from app.models.repository import Base, Repository
from app.config.config import RABBITMQ_URL, BACKEND_NOTIFY_URL

QUEUE_NAME = "repos_import_queue"

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s - %(message)s"
)
logger = logging.getLogger(__name__)

def main():
    """
    Entry point for the worker. In production, you might run this in a separate
    container via:
        python -m app.workers.importer
    """
    # Ensure DB schema is ready
    Base.metadata.create_all(bind=engine)

    while True:
        try:
            logger.info("Attempting to connect to RabbitMQ...")
            parameters = pika.URLParameters(RABBITMQ_URL)
            connection = pika.BlockingConnection(parameters)
            channel = connection.channel()

            # Declare queue and set prefetch
            channel.queue_declare(queue=QUEUE_NAME, durable=True)
            channel.basic_qos(prefetch_count=1)
            channel.basic_consume(queue=QUEUE_NAME, on_message_callback=on_message_callback)

            logger.info(f"Connected to RabbitMQ. Waiting for messages on queue '{QUEUE_NAME}'...")
            channel.start_consuming()

        except pika.exceptions.AMQPConnectionError:
            logger.error("Connection to RabbitMQ failed. Retrying in 5 seconds...")
            time.sleep(5)
        except KeyboardInterrupt:
            logger.warning("Worker interrupted by user. Shutting down gracefully.")
            try:
                channel.stop_consuming()
                connection.close()
            except Exception:
                pass
            break
        except Exception as e:
            logger.exception("Unexpected error in worker main loop: %s", e)
            time.sleep(5)

def on_message_callback(ch, method, properties, body):
    logger.info("Received a message from the queue.")
    try:
        message_str = body.decode("utf-8")
        repos_data = json.loads(message_str)
        logger.info(f"Processing {len(repos_data)} repositories...")

        # Simulate a long processing time
        time.sleep(5)

        # Store in the DB
        db: Session = SessionLocal()
        try:
            for repo_json in repos_data:
                repo = Repository(**repo_json)
                db.add(repo)
            db.commit()
            logger.info("Repositories inserted into the database.")
        except Exception as e:
            db.rollback()
            logger.error("Error inserting repositories: %s", e)
            raise
        finally:
            db.close()

         # Notify the backend to broadcast over WS
        notify_frontend(len(repos_data))

        ch.basic_ack(delivery_tag=method.delivery_tag)
        logger.info("Message acknowledged.")

    except Exception as e:
        logger.exception("Failed to process message: %s", e)
        ch.basic_nack(delivery_tag=method.delivery_tag, requeue=False)

def notify_frontend(count: int):
    """
    Calls the /notify endpoint from the backend to broadcast a WS message.
    BACKEND_NOTIFY_URL is read from environment variables via config.py
    """
    try:
        payload = {"message": f"Imported {count} repositories!"}
        resp = requests.post(f"{BACKEND_NOTIFY_URL}/notify", json=payload, timeout=5)
        if resp.status_code == 200 or resp.status_code == 201:
            logger.info("Successfully notified frontend via WebSocket broadcast.")
        else:
            logger.warning(f"Notify call returned status code: {resp.status_code}")
    except Exception as e:
        logger.error("Error notifying frontend: %s", e)


if __name__ == "__main__":
    main()
