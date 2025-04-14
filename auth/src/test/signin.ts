import { app } from "../app";
import request from "supertest";

export const signin = async () => {
  const email = "test@test.com";
  const password = "password";

  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email,
      password,
    })
    .expect(200);

  const cookie = response.get("Set-Cookie");
  return cookie;
};
