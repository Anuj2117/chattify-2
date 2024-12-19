import Conversation from "../models/conversation_model.js";
import Message from "../models/message_model.js";
import { getReceiverSocket } from "../socketIo/server.js";

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let conversation = await Conversation.findOne({
      paricipents: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        paricipents: [senderId, receiverId],
      });

      const newMessage = new Message({
        senderId,
        receiverId,
        message,
      });
      
      if (newMessage) {
        conversation.messages.push(newMessage._id);
      }
      await Promise.all([conversation.save(), newMessage.save()]);
      const receiverSocketId=getReceiverSocket(receiverId);
      if(receiverSocketId){
        io.to(receiverSocketId).emit("newMessage",newMessage);
      }
      res
        .status(201)
        .json({ message: "message sent successfully", newMessage });
    }
  } catch (error) {
    console.log("Error in sending message" + error);
    res.status(500).json({ message: "Internal serval error" });
  }
};

export const getMessage = async (req, res) => {
  try {
    const { id: chatuser } = req.params;
    const senderId = req.user._id;

    let conversation = await Conversation.findOne({
      paricipents: { $all: [senderId, chatuser] },
    }).populate("messages");
    if (!conversation) {
      return res.status(201).json({ message: "No conversation found" });
    }
    const messages = conversation.messages;
    res.status(201).json(messages);
  } catch (error) {
    console.log("Message getting error" + error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
