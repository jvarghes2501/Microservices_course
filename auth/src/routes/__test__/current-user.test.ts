import request from "supertest";
import { app } from "../../app";
import { signin } from "../../test/signin";
it("check to see if it responds with details about the current user", async () => {
  const cookie = await signin();

  if (!cookie) {
    throw new Error("Cookie not set after signup");
  }
  const response = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", cookie)
    .send()
    .expect(200);

  expect(response.body.currentUser.email).toEqual("test@test.com");
});

it("check if it responds with null if not authenticated", async () => {
  const response = await request(app)
    .get("/api/users/currentuser")
    .send()
    .expect(200);

  expect(response.body.currentUser).toBeNull();
});
