import { Publisher, Subjects, TicketUpdatedEvent } from "@jvctickets/common";
export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
