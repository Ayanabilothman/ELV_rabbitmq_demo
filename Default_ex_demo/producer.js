// Producer: an image is "submitted", so we send one crop job to RabbitMQ.
//
// Transport: the Default Exchange only.
// In AMQP the default exchange is the exchange whose name is "" (empty string).
// Publishing to it with a routing key equal to a queue name delivers the
// message straight to that queue.

const amqp = require("amqplib");

const QUEUE = "image-processing-queue";
const DEFAULT_EXCHANGE = ""; // the Default Exchange
const CROP_WIDTH = 200;
const CROP_HEIGHT = 200;

// Stand-in for "images that were submitted". Each one becomes a crop job.
const submittedImages = [
  "cat.jpg",
  "dog.jpg",
  "sunset.jpg",
  "invoice.png",
  "profile.png",
  "landscape.jpg",
  "meme.jpg",
  "receipt.png",
  "diagram.png",
];

async function main() {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  // One shared queue for all workers.
  await channel.assertQueue(QUEUE, { durable: false });
  // durable option for queue & exchange

  for (const image of submittedImages) {
    const job = {
      image,
      cropWidth: CROP_WIDTH,
      cropHeight: CROP_HEIGHT,
    };

    // Default Exchange: exchange name "", routing key = queue name.
    channel.publish(DEFAULT_EXCHANGE, QUEUE, Buffer.from(JSON.stringify(job)));

    // Msg persistent = true

    console.log(
      `[producer] queued crop job: ${image} -> ${CROP_WIDTH}x${CROP_HEIGHT}`,
    );
  }

  await channel.close();
  await connection.close();
  console.log(
    `[producer] done - ${submittedImages.length} jobs sent to "${QUEUE}"`,
  );
}

main().catch((err) => {
  console.error("[producer] error:", err.message);
  process.exit(1);
});
