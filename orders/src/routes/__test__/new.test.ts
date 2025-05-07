import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { signin } from "../../test/signin";
import { Order } from "../../models/order";
import { Ticket } from "../../models/ticket";
import { OrderStatus } from "@jvctickets/common";
import { natsWrapper } from "../../nats-wrapper";
it("returns error if ticket doe not exist", async () => {
  const ticketId = new mongoose.Types.ObjectId();

  await request(app)
    .post("./api/orders")
    .set("Cookie", await signin())
    .send({
      ticketId,
    })
    .expect(404);
});
it("returns error if ticket is reserved", async () => {
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
    id: new mongoose.Types.ObjectId().toHexString(),
  });
  await ticket.save();

  const order = Order.build({
    ticket,
    userId: "fdskjhfskj",
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });

  await order.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", await signin())
    .send({ ticketId: ticket.id })
    .expect(400);
});
it("reserve a ticket", async () => {
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
    id: new mongoose.Types.ObjectId().toHexString(),
  });

  await ticket.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", await signin())
    .send({ ticketId: ticket.id })
    .expect(201);
});

it("creates an order created event", async () => {
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
    id: new mongoose.Types.ObjectId().toHexString(),
  });

  await ticket.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", await signin())
    .send({ ticketId: ticket.id })
    .expect(201);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
