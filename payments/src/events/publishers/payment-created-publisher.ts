import { Subjects, Publisher, PaymentCreatedEvent } from "@jvctickets/common";
export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
