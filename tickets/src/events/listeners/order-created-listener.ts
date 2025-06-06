import { Listener, OrderCreatedEvent, Subjects } from "@jvctickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";
export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    // find the ticket that order is reserving
    const ticket = await Ticket.findById(data.ticket.id);
    // throw error if no ticket
    if (!ticket) {
      throw new Error("Ticket not found");
    }
    // mark ticket being reserved and set orderId property
    ticket.set({
      orderId: data.id,
    });
    // save the ticket
    await ticket.save();
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.userId,
      orderId: ticket.orderId,
      userId: ticket.userId,
      version: ticket.version,
    });
    // ack the message
    msg.ack();
  }
}
