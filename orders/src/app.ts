import express, { Request, Response, NextFunction } from "express";
import { json } from "body-parser";

import { errorHandler, NotFoundError, currentUser } from "@jvctickets/common";
import cookieSession from "cookie-session"; // run npm install cookie-session @types/cookie-session

import { deleteOrderRouter } from "./routes/delete";
import { showOrderRouter } from "./routes/show";
import { indexOrderRouter } from "./routes";
import { newOrderRouter } from "./routes/new";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);
app.use(currentUser);
app.use(deleteOrderRouter);
app.use(showOrderRouter);
app.use(indexOrderRouter);
app.use(newOrderRouter);

app.use(async (req: Request, res: Response, next: NextFunction) => {
  console.log(`Undefined route accessed: ${req.url}`);
  throw new NotFoundError();
});

app.use(errorHandler);
export { app };
