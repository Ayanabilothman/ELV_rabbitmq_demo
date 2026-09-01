# Notification Gateway — RabbitMQ Direct Exchange Demo

A minimal demo showing how a **Direct Exchange** routes messages to different
queues based on the **routing key**.

## What it does

- Exchange: `notifications-exchange` (type: `direct`)
- Queues:
  - `sms-queue`   bound with routing key `sms`
  - `email-queue` bound with routing key `email`
- `send.js` publishes 4 notifications (2 with routing key `sms`, 2 with `email`).
- `sms-worker.js` consumes `sms-queue`; `email-worker.js` consumes `email-queue`.

The Direct Exchange delivers each message only to the queue whose binding key
exactly matches the message's routing key.

## Prerequisites

- Node.js
- A running RabbitMQ server on `amqp://localhost` (default port 5672).
  Quick start with Docker:

```bash
docker run -it --rm --name rabbitmq -p 5672:5672 rabbitmq:3
```

## Install

```bash
npm install
```

## Run

Open three terminals.

Terminal 1 — SMS worker:

```bash
npm run sms-worker
```

Terminal 2 — Email worker:

```bash
npm run email-worker
```

Terminal 3 — send the notifications:

```bash
npm run send
```

## Expected behavior

`send.js` prints:

```
Sent [routingKey=sms] SMS: Your verification code is 123456
Sent [routingKey=email] EMAIL: Welcome to our service!
Sent [routingKey=sms] SMS: Your package has shipped
Sent [routingKey=email] EMAIL: Your monthly invoice is ready
```

The **SMS worker** receives only the `sms` messages:

```
[sms-worker] received: SMS: Your verification code is 123456
[sms-worker] received: SMS: Your package has shipped
```

The **Email worker** receives only the `email` messages:

```
[email-worker] received: EMAIL: Welcome to our service!
[email-worker] received: EMAIL: Your monthly invoice is ready
```

Each notification is routed to the queue matching its routing key — that is the
Direct Exchange routing by task type.
