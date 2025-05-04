import request from "supertest";
import { app } from "../../app";
import { signin } from "../../test/signin";

const createTicket = async () => {
  const cookie = await signin();
  return request(app).post("/api/tickets").set("Cookie", cookie).send({
    title: "asfa",
    price: 20,
  });
};

it("check to see if it can fetch a list of tickest", async () => {
  await createTicket();
  await createTicket();
  await createTicket();

  const response = await request(app).get("/api/tickets").send({}).expect(200);

  expect(response.body.length).toEqual(3);
});
