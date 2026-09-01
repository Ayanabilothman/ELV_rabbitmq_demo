const amqp = require("amqplib");

const EXCHANGE = "notifications-exchange";

// Each notification carries the routing key that decides which queue it lands in.
const notifications = [
  { routingKey: "sms", message: "SMS: Your verification code is 123456" },
  { routingKey: "email", message: "EMAIL: Welcome to our service!" },
  { routingKey: "sms", message: "SMS: Your package has shipped" },
  { routingKey: "email", message: "EMAIL: Your monthly invoice is ready" },
];

async function main() {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  await channel.assertExchange(EXCHANGE, "direct", { durable: false });

  // loop xx
  for (const { routingKey, message } of notifications) {
    channel.publish(EXCHANGE, routingKey, Buffer.from(message));
    console.log(`Sent [routingKey=${routingKey}] ${message}`);
  }

  await channel.close();
  await connection.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
