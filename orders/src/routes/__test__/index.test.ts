import request from "supertest";
import { app } from "../../app";
import { Order } from "../../models/order";
import { Ticket } from "../../models/ticket";
import { signin } from "../../test/signin";
it("fetches orders for a particular user", async () => {
  //create three tickets
  const ticket1 = Ticket.build({
    title: "concert2",
    price: 10,
  });
  await ticket1.save();

  const ticket2 = Ticket.build({
    title: "concert2",
    price: 20,
  });
  await ticket2.save();

  const ticket3 = Ticket.build({
    title: "concert3",
    price: 30,
  });
  await ticket3.save();

  const user1 = await signin();
  const user2 = await signin();
  //create one order as user 1
  await request(app)
    .post("/api/orders")
    .set("Cookie", user1)
    .send({ ticketId: ticket1.id })
    .expect(201);
  // create two orders as user 2
  const { body: order1 } = await request(app)
    .post("/api/orders")
    .set("Cookie", user2)
    .send({ ticketId: ticket2.id })
    .expect(201);
  const { body: order2 } = await request(app)
    .post("/api/orders")
    .set("Cookie", user2)
    .send({ ticketId: ticket3.id })
    .expect(201);
  //fetch orders for user 2
  const response = await request(app)
    .get("/api/orders")
    .set("Cookie", user2)
    .expect(200);

  //there should be only 2 orders for user 2
  expect(response.body.length).toEqual(2);
  expect(response.body[0].id).toEqual(order1.id);
  expect(response.body[1].id).toEqual(order2.id);
  expect(response.body[0].ticket.id).toEqual(ticket2.id);
  expect(response.body[0].ticket.id).toEqual(ticket3.id);
});
