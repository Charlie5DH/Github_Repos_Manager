import pika
from app.config.config import RABBITMQ_URL

def publish_message(queue_name: str, message: str):
    connection = pika.BlockingConnection(pika.URLParameters(RABBITMQ_URL))
    channel = connection.channel()
    channel.queue_declare(queue=queue_name, durable=True)
    channel.basic_publish(
        exchange="",
        routing_key=queue_name,
        body=message
    )
    connection.close()