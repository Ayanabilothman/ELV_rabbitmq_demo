// Worker: a competing consumer on the shared queue.
//
// Run this file 3 times to get 3 workers. RabbitMQ will
// hand each job to exactly one of them -> Point-to-Point / Work Queue.

const amqp = require("amqplib");

const QUEUE = "image-processing-queue";
const WORKER_ID = String(process.pid);

// Simple fixed-size crop. Simulated with a short delay so that the
// distribution of jobs across the 3 workers is easy to watch.
function cropImage(job) {
  const processingMs = 500 + Math.floor(Math.random() * 1500);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`${job.image} cropped to ${job.cropWidth}x${job.cropHeight}`);
    }, processingMs);
  });
}

async function main() {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  // Same queue as every other worker.
  await channel.assertQueue(QUEUE, { durable: false });

  // Fair dispatch: don't give this worker a new job until it has
  // acked the current one.
  await channel.prefetch(1);

  console.log(`[worker ${WORKER_ID}] waiting for jobs on "${QUEUE}"`);

  await channel.consume(QUEUE, async (msg) => {
    if (msg === null) return;

    const job = JSON.parse(msg.content.toString());
    console.log(`[worker ${WORKER_ID}] received: ${job.image}`);

    setTimeout(async () => {
      const result = await cropImage(job);
      console.log(`[worker ${WORKER_ID}] finished: ${result}`);

      // manual ack
      channel.ack(msg);
    }, 8000);
    // Task: Idempotency
    // at least once >>> needs consumer idempotent
  });
}

main().catch((err) => {
  console.error(`[worker ${WORKER_ID}] error:`, err.message);
  process.exit(1);
});
