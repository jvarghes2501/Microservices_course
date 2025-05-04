import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { signin } from "../../test/signin";
import { natsWrapper } from "../../nats-wrapper";
it("checks if it returns a 404 if the provided id doesnt exist", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const cookie = await signin();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", cookie)
    .send({
      title: "fdsfds",
      price: 20,
    })
    .expect(404);
});

it("checks if a 401 is returned if the user is not authenticated", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: "fdsfds",
      price: 20,
    })
    .expect(401);
});

it("checks if 401 is returned if teh user doesnt own the ticket", async () => {
  const response = await request(app)
    .put("/api/tickets/")
    .set("Cookie", await signin())
    .send({
      title: "fdsfds",
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", await signin())
    .send({
      title: "fdshkjdsfh",
      price: 1000,
    })
    .expect(401);
});

it("returns a 400 if the user provides invalid title or price", async () => {
  const cookie = await signin();
  const response = await request(app)
    .put("/api/tickets/")
    .set("Cookie", cookie)
    .send({
      title: "fdsfds",
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "",
      price: 20,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "fsdfsfqw",
      price: -10,
    })
    .expect(400);
});

it("check if it updates the ticket succefully if valid inputs provided", async () => {
  const cookie = await signin();
  const response = await request(app)
    .put("/api/tickets/")
    .set("Cookie", cookie)
    .send({
      title: "fdsfds",
      price: 20,
    });

  const test = await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "New title", price: 100 })
    .expect(200);

  console.log(test.body.title);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send();

  expect(ticketResponse.body.title).toEqual("New title");
  expect(ticketResponse.body.price).toEqual(100);
});

it("publishes an event", async () => {
  const cookie = await signin();
  const response = await request(app)
    .put("/api/tickets/")
    .set("Cookie", cookie)
    .send({
      title: "fdsfds",
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "New title", price: 100 })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
