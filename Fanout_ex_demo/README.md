# RabbitMQ Fanout Exchange Demo

A minimal educational demo showing how a **Fanout Exchange** broadcasts one event
to multiple services.

## Use case

An e-commerce **Order Checkout** system. When an order is completed, the Checkout
service publishes **one** message to the `order-events` fanout exchange. The
message payload carries the event name:

```json
{ "event": "order.completed", "orderId": "ORD-...", "customer": "Aya", "total": 149.99 }
```

Three independent services each receive their own copy:

- `inventory-queue`  → Inventory service
- `invoicing-queue`  → Invoicing service
- `shipping-queue`   → Shipping service

```
                          ┌──────────────────────┐
                          │  Fanout Exchange     │
   Checkout ──publish──▶  │  "order-events"      │
                          └───────┬───────┬──────┘
                                  │       │       │
                     ┌────────────┘       │       └────────────┐
                     ▼                    ▼                    ▼
             inventory-queue      invoicing-queue       shipping-queue
                     │                    │                    │
        inventory-consumer.js  invoicing-consumer.js  shipping-consumer.js
```

A fanout exchange ignores the routing key and delivers every message to **all**
bound queues. The event name (`order.completed`) lives in the message body, not
in the exchange name or a routing key.

## Prerequisites

- Node.js
- A running RabbitMQ instance on `amqp://localhost`. With Docker:

  ```bash
  docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management
  ```

## Install

```bash
npm install
```

## Run

Open **four** terminals.

Start the three consumers, each in its own file, one per service:

```bash
node inventory-consumer.js
```

```bash
node invoicing-consumer.js
```

```bash
node shipping-consumer.js
```

Then publish one message:

```bash
node publisher.js
```

## Expected behavior

- The publisher sends **one** message to the `order-events` exchange.
- All **three** consumers print the **same** `order.completed` event.
- Each queue got its own independent copy of the event — that is the Fanout
  Exchange broadcasting an event to every subscribed service.
