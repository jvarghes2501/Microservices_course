import { Subjects, Publisher, OrderCancelledEvent } from "@jvctickets/common";
export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
