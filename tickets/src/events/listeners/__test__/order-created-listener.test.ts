import { OrderCreatedListener } from "../order-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/ticket";
import { OrderCreatedEvent, OrderStatus } from "@jvctickets/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
it("set the userID of the ticket", async () => {
  // create a listener
  const listener = new OrderCreatedListener(natsWrapper.client);

  // create and save ticket
  const ticket = Ticket.build({
    title: "concert",
    price: 99,
    userId: "asdfh",
  });
  await ticket.save();

  //create fake event
  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: "fdshjsdfk",
    expiresAt: "fdshjk",
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  await listener.onMessage(data, msg);
  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).toEqual(data.id);
});

it("acks the message", async () => {
  // create a listener
  const listener = new OrderCreatedListener(natsWrapper.client);

  // create and save ticket
  const ticket = Ticket.build({
    title: "concert",
    price: 99,
    userId: "asdfh",
  });
  await ticket.save();

  //create fake event
  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: "fdshjsdfk",
    expiresAt: "fdshjk",
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});

it("publishes a ticket update event", async () => {
  // create a listener
  const listener = new OrderCreatedListener(natsWrapper.client);

  // create and save ticket
  const ticket = Ticket.build({
    title: "concert",
    price: 99,
    userId: "asdfh",
  });
  await ticket.save();

  //create fake event
  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: "fdshjsdfk",
    expiresAt: "fdshjk",
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  await listener.onMessage(data, msg);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
