import { Publisher, Subjects, TicketCreatedEvent } from "@jvctickets/common";
export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
