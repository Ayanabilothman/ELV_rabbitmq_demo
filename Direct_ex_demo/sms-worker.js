const amqp = require("amqplib");

const EXCHANGE = "notifications-exchange";
const QUEUE = "sms-queue";
const BINDING_KEY = "sms";

async function main() {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  await channel.assertExchange(EXCHANGE, "direct", { durable: false });
  await channel.assertQueue(QUEUE, { durable: false });

  await channel.bindQueue(QUEUE, EXCHANGE, BINDING_KEY);

  console.log(
    `[sms-worker] waiting for messages on "${QUEUE}" (routingKey=${BINDING_KEY})`,
  );

  channel.consume(QUEUE, (msg) => {
    if (!msg) return;
    console.log(`[sms-worker] received: ${msg.content.toString()}`);
    channel.ack(msg);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
