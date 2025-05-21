import request from "supertest";
import { app } from "../../app";
import { signin } from "../../test/signin";
import mongoose, { mongo } from "mongoose";
import { Order } from "../../models/order";
import { OrderStatus } from "@jvctickets/common";
import { stripe } from "../../stripe";
jest.mock("../../stripe");
it("return a 404 when purchasing and order that does not exist", async () => {
  await request(app)
    .post("/api/payments")
    .set("Cookie", await signin())
    .send({
      token: "dfhsk",
      orderId: new mongoose.Types.ObjectId().toHexString(),
    });

  expect(404);
});
it("return a 401 when purchasing and order that doesnt belong to the user", async () => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 20,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", await signin())
    .send({
      token: "dfhsk",
      orderId: order.id,
    });

  expect(401);
});
it("return a 400 when trying to purchase an order that was cancelled", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: userId,
    version: 0,
    price: 20,
    status: OrderStatus.Cancelled,
  });
  await order.save();

  await request(app)
    .post("api/payments")
    .set("Cookie", await signin(userId))
    .send({
      token: "dfhsk",
      orderId: order.id,
    })
    .expect(400);
});

it("returns a 204 with valid inputs", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: userId,
    version: 0,
    price: 20,
    status: OrderStatus.Cancelled,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", await signin(userId))
    .send({
      token: "tok_visa",
      orderId: order.id,
    })
    .expect(201);

  const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
  expect(chargeOptions.source).toEqual("tok_visa");
  expect(chargeOptions.amount).toEqual(20 * 100);
  expect(chargeOptions.currency).toEqual("usd");
});
