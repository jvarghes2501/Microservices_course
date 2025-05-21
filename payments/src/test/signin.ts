import { app } from "../app";
import request from "supertest";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
export const signin = async (id?: string) => {
  //build a fake JWT
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: "test@test.com",
  };

  // create the jwt
  const token = jwt.sign(payload, process.env.JWT_KEY!);
  //build session object
  const session = { jwt: token };
  // turn into JSON
  const sessionJSON = JSON.stringify(session);
  //take JSON and encode to base64
  const base64 = Buffer.from(sessionJSON).toString("base64");
  //return a string with encoded data
  return [`session=${base64}`];
};
