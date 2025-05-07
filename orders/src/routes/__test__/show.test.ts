import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { signin } from "../../test/signin";

it("fetches the order", async () => {
  //create a ticket
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
    id: "abc",
  });
  await ticket.save();
  const user = await signin();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);
  //make a request to build an order with this ticket
  //fetch the order
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(200);

  expect(fetchedOrder.id).toEqual(order.id);
});

it("returns an error if a user tries to fetch order of another", async () => {
  //create a ticket
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
    id: "abc",
  });
  await ticket.save();
  const user = await signin();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);
  //make a request to build an order with this ticket
  //fetch the order
  await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", await signin())
    .send()
    .expect(401);
});
