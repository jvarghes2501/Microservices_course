import express, { Request, Response, NextFunction } from "express";
import { json } from "body-parser";
import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";
import { errorHandler, NotFoundError } from "@jvctickets/common";
import cookieSession from "cookie-session"; // run npm install cookie-session @types/cookie-session
const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.use(async (req: Request, res: Response, next: NextFunction) => {
  console.log(`Undefined route accessed: ${req.url}`);
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
