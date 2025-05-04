import request from "supertest";
import { app } from "../../app";
import { signin } from "../../test/signin";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";
jest.mock("../../nats-wrapper");
it("checks that there is route handler to /api/tickets for post requests", async () => {
  const response = await request(app).post("/api/tickets").send({});

  expect(response.status).not.toEqual(404);
});

it("check if it is only accessible if the user is signed in", async () => {
  await request(app).post("/api/tickets").send({}).expect(401);
});

it("return a status not 401 if the user is signed in", async () => {
  const cookie = await signin();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({});
  expect(response.status).not.toEqual(401);
});

it("checks if it returns an error if an invalid title is provided", async () => {
  const cookie = await signin();
  await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "",
      price: 10,
    })
    .expect(400);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      price: 10,
    })
    .expect(400);
});

it("checks if it returns an error if an invalid price is provided", async () => {
  const cookie = await signin();
  await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "fdshfksdl",
      price: -10,
    })
    .expect(400);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "fdshfksdl",
    })
    .expect(400);
});

it("creates a ticket with valid inputs", async () => {
  // need to check the ticket was saved in the database
  const cookie = await signin();
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);
  await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "fdshfksdl",
      price: 20,
    })
    .expect(201);
  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].price).toEqual(20);
});

it("publish an event", async () => {
  const cookie = await signin();

  await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "fdshfksdl",
      price: 20,
    })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
