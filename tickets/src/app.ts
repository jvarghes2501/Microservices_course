import express, { Request, Response, NextFunction } from "express";
import { json } from "body-parser";

import { errorHandler, NotFoundError, currentUser } from "@jvctickets/common";
import cookieSession from "cookie-session"; // run npm install cookie-session @types/cookie-session
import { createTicketRouter } from "./routes/new";
import { showTicketRouter } from "./routes/show";
import { indexTicketRouter } from "./routes";
import { updateTicketRouter } from "./routes/update";
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
app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(indexTicketRouter);
app.use(updateTicketRouter);

app.use(async (req: Request, res: Response, next: NextFunction) => {
  console.log(`Undefined route accessed: ${req.url}`);
  throw new NotFoundError();
});

app.use(errorHandler);
export { app };
