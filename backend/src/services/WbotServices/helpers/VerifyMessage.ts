import { Message as WbotMessage } from "whatsapp-web.js";
import Contact from "../../../models/Contact";
import Ticket from "../../../models/Ticket";
import CreateMessageService from "../../MessageServices/CreateMessageService";
import VerifyQuotedMessage from "./VerifyQuotedMessage";

const VerifyMessage = async (
  msg: WbotMessage,
  ticket: Ticket,
  contact: Contact
) => {
  const quotedMsg = await VerifyQuotedMessage(msg);

  const messageData = {
    id: msg.id.id,
    ticketId: ticket.id,
    contactId: msg.fromMe ? undefined : contact.id,
    body: msg.body,
    fromMe: msg.fromMe,
    mediaType: msg.type,
    read: msg.fromMe,
    quotedMsgId: quotedMsg?.id,
    timestamp: msg.timestamp
  };

  await ticket.update({ lastMessage: msg.body });
  await CreateMessageService({ messageData, tenantId: ticket.tenantId });
};

export default VerifyMessage;
