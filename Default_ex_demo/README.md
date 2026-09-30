# RabbitMQ Work Queue Demo — Image Cropping Jobs

A minimal educational demo of the **Point-to-Point / Work Queue** pattern with
**competing consumers** in RabbitMQ.

## Use case

When an image is submitted, a job is sent to RabbitMQ to crop that image to a
fixed size (200x200). Three worker processes share one queue; RabbitMQ delivers
each job to exactly one worker.

## How it works

- **Exchange:** the Default Exchange only (exchange name `""`). The producer
  publishes with the queue name as the routing key, so messages go straight to
  the queue.
- **Queue:** a single queue named `image-processing-queue`.
- **Workers:** 3 processes running `worker.js`, all consuming from that same
  queue. Each uses `prefetch(1)` and acks a job only when the crop is done.
- **Cropping:** simulated with a short random delay, then a log line showing the
  fixed output size.

## Prerequisites

- Node.js 16+
- A running RabbitMQ on `localhost:5672`. For example, with Docker:

```bash
docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management
```

## Setup

```bash
npm install
```

## Run

1. Start the 3 workers (one terminal):

```bash
npm run workers
```

2. Submit the image-cropping jobs (another terminal):

```bash
npm run produce
```

> Prefer separate terminals per worker? Run `node worker.js 1`, `node worker.js 2`,
> and `node worker.js 3` instead of `npm run workers`.

## What to expect

- The producer sends 9 crop jobs and exits.
- The 9 jobs are spread across `worker 1`, `worker 2`, and `worker 3`
  (roughly 3 each).
- Each job is processed by **exactly one** worker — never duplicated.
- A worker that is still cropping does not receive another job until it acks
  (fair dispatch), so faster workers naturally pick up more jobs.

Example (order and split will vary):

```
[worker 1] received: cat.jpg
[worker 2] received: dog.jpg
[worker 3] received: sunset.jpg
[worker 2] finished: dog.jpg cropped to 200x200
[worker 2] received: invoice.png
[worker 1] finished: cat.jpg cropped to 200x200
[worker 1] received: profile.png
...
```


# License

Copyright © 2026 Aya Nabil Othman. All rights reserved.

This repository is provided for educational and demonstration purposes only.

You may view, clone, and run the code for personal learning.

You may not copy, redistribute, republish, sublicense, or use this code or substantial portions of it in commercial products, paid courses, tutorials, training programs, workshops, or other paid content without prior written permission.

