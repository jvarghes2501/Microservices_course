import { Ticket } from "../ticket";

it("optomisitic currency control", async () => {
  //create a ticket
  const ticket = Ticket.build({
    title: "concert",
    price: 5,
    userId: "123",
  });
  // save the ticket to database
  await ticket.save();
  //fetch the ticket twice
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);
  // make two changes to the ticket we fetched
  firstInstance!.set({ price: 10 });
  secondInstance!.set({ price: 15 });
  //save the first fetched ticket
  await firstInstance!.save();
  //save second fetched ticket
  try {
    await secondInstance!.save();
  } catch (err) {
    return;
  }
});
