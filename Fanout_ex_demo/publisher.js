// Checkout service: publishes ONE `order.completed` event when an order is done.

const amqp = require("amqplib");

const EXCHANGE = "order-events";

async function main() {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  // A fanout exchange broadcasts every message to ALL bound queues.
  await channel.assertExchange(EXCHANGE, "fanout", { durable: false });

  const message = {
    event: "order.completed",
    orderId: "ORD-" + Date.now(),
    customer: "Aya",
    total: 149.99,
    completedAt: new Date().toISOString(),
  };

  // Routing key is '' because a fanout exchange ignores routing keys.
  channel.publish(EXCHANGE, "", Buffer.from(JSON.stringify(message)));
  console.log('[Checkout] Published one "order.completed" event:', message);

  await channel.close();
  await connection.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
