# RabbitMQ Exchange Demos

Three small Node.js (`amqplib`) demos, each showing one RabbitMQ exchange type.
Each folder has its own README with full run steps.

| Demo | Exchange | Pattern | Use case |
|------|----------|---------|----------|
| [Default Exchange](Default%20Exchange/) | Default (`""`) | Work queue / competing consumers | Image-cropping jobs |
| [Direct Exchange](Direct%20Exchange/) | `direct` | Route by exact routing key | SMS / Email notifications |
| [Fanout Exchange](Fanout%20Exchange/) | `fanout` | Broadcast to all bound queues | Order checkout events |

## 1. Default Exchange — Work Queue

The producer sends 9 crop jobs straight to `image-processing-queue` (routing key
= queue name). Three workers share that queue; each job goes to **exactly one**
worker. `prefetch(1)` gives fair dispatch, so faster workers take more jobs.

## 2. Direct Exchange — Routing by Key

`send.js` publishes 4 notifications to `notifications-exchange` with routing key
`sms` or `email`. `sms-queue` is bound to `sms`, `email-queue` to `email`, so
each worker only receives its own message type.

## 3. Fanout Exchange — Broadcast

The checkout service publishes **one** `order.completed` event to
`order-events`. The inventory, invoicing, and shipping queues are all bound to
it, so every service gets its own copy. The routing key is ignored.

## Quick start

Start RabbitMQ:

```bash
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management
```

Then in any demo folder run `npm install`, start the consumers first, then the
producer/publisher (see each folder's README).


# License

Copyright © 2026 Aya Nabil Othman. All rights reserved.

This repository is provided for educational and demonstration purposes only.

You may view, clone, and run the code for personal learning.

You may not copy, redistribute, republish, sublicense, or use this code or substantial portions of it in commercial products, paid courses, tutorials, training programs, workshops, or other paid content without prior written permission.


