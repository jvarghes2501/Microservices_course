import { Publisher, OrderCreatedEvent, Subjects } from "@jvctickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
