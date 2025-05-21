import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedListener } from "../order-created-listener";
import mongoose from "mongoose";
import { OrderCreatedEvent, OrderStatus } from "@jvctickets/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../../models/order";
it("replicates the order info", async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    expiresAt: "fdsjhgds",
    userId: "fdgjkdfsg",
    status: OrderStatus.Created,
    ticket: {
      id: "hkjhkhhfsds",
      price: 10,
    },
  };
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  await listener.onMessage(data, msg);

  const order = await Order.findById(data.id);
  expect(order!.price).toEqual(data.ticket.price);
});

it("acks the message", async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    expiresAt: "fdsjhgds",
    userId: "fdgjkdfsg",
    status: OrderStatus.Created,
    ticket: {
      id: "hkjhkhhfsds",
      price: 10,
    },
  };
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});
