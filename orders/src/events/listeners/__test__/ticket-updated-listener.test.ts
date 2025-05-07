import mongoose from "mongoose";
import { TicketUpdatedListener } from "../ticket-updated-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/ticket";
import { TicketUpdatedEvent } from "@jvctickets/common";
import { Message } from "node-nats-streaming";
it("finds, updates, and saves a ticket", async () => {
  //create a listener
  const listener = new TicketUpdatedListener(natsWrapper.client);

  //create and save ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });
  await ticket.save();

  //create a fake data object
  const data: TicketUpdatedEvent["data"] = {
    id: ticket.id,
    version: ticket.version + 1,
    title: "new concert",
    price: 999,
    userId: "ahfjdksh",
  };

  //create fake mesg
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.version).toEqual(data.version);
});

it("ack the message", async () => {
  //create a listener
  const listener = new TicketUpdatedListener(natsWrapper.client);

  //create and save ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });
  await ticket.save();

  //create a fake data object
  const data: TicketUpdatedEvent["data"] = {
    id: ticket.id,
    version: ticket.version + 1,
    title: "new concert",
    price: 999,
    userId: "ahfjdksh",
  };

  //create fake mesg
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it("should not call if the event has a wrong version number", async () => {
  //create a listener
  const listener = new TicketUpdatedListener(natsWrapper.client);

  //create and save ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });
  await ticket.save();

  //create a fake data object
  const fakeVersion = 10;
  const data: TicketUpdatedEvent["data"] = {
    id: ticket.id,
    version: fakeVersion,
    title: "new concert",
    price: 999,
    userId: "ahfjdksh",
  };

  //create fake mesg
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  try {
    await listener.onMessage(data, msg);
  } catch (err) {}
  expect(msg.ack).not.toHaveBeenCalled();
});
