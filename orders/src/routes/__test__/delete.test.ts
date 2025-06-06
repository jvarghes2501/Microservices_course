import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { signin } from "../../test/signin";
import { Order } from "../../models/order";
import { OrderStatus } from "@jvctickets/common";
import { natsWrapper } from "../../nats-wrapper";
import mongoose from "mongoose";
it("mark the order as cancelled", async () => {
  //creat a ticket
  const ticket = Ticket.build({
    title: "Concert",
    price: 20,
    id: new mongoose.Types.ObjectId().toHexString(),
  });
  await ticket.save();

  const user = await signin();

  //create an order
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // cancel the order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .expect(204);

  // check if the status for that order was updated to cancelled
  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("emits an order cancelled event was triggered", async () => {
  //creat a ticket
  const ticket = Ticket.build({
    title: "Concert",
    price: 20,
    id: new mongoose.Types.ObjectId().toHexString(),
  });
  await ticket.save();

  const user = await signin();

  //create an order
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // cancel the order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .expect(204);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
