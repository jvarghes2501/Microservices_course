import { TicketCreatedListener } from "../ticket-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketCreatedEvent } from "@jvctickets/common";
import mongoose, { mongo } from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";
it("Creates and saves a ticket", async () => {
  //creatae instance of listener
  const listener = new TicketCreatedListener(natsWrapper.client);
  //create fake event
  const data: TicketCreatedEvent["data"] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };
  // create fake message
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  // call onMessage function
  await listener.onMessage(data, msg);
  //make assertion to make sure ticket was created
  const ticket = await Ticket.findById(data.id);

  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
});

it("ack message", async () => {
  //creatae instance of listener
  const listener = new TicketCreatedListener(natsWrapper.client);
  //create fake event
  const data: TicketCreatedEvent["data"] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };
  // create fake message
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  // call onMessage function
  await listener.onMessage(data, msg);
  //make assertion to make sure ticket was created

  expect(msg.ack).toHaveBeenCalled();
});
