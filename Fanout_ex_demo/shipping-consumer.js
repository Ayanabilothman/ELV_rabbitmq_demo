// Shipping service: consumes `order.completed` events from its own queue.

const amqp = require('amqplib');

const EXCHANGE = 'order-events';
const QUEUE = 'shipping-queue';

async function main() {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();

  await channel.assertExchange(EXCHANGE, 'fanout', { durable: false });
  await channel.assertQueue(QUEUE, { durable: false });

  // Bind this queue to the fanout exchange (routing key is ignored).
  await channel.bindQueue(QUEUE, EXCHANGE, '');

  console.log(`[${QUEUE}] Waiting for "order.completed" events...`);

  channel.consume(QUEUE, (msg) => {
    if (!msg) return;
    const event = JSON.parse(msg.content.toString());
    console.log(`[${QUEUE}] Received "${event.event}":`, event);
    channel.ack(msg);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
