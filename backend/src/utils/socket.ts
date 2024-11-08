import cookie from "cookie";
import jwt from "jsonwebtoken";
import { Server, Socket } from "socket.io";
ChatEventEnum;
import { ApiError } from "../utils/ApiError.js";
import { ChatEventEnum } from "./constants.js";
import { Request } from "express";

const mountJoinChatEvent = (socket: Socket) => {
  socket.on(ChatEventEnum.JOIN_CHAT_EVENT, (chatId) => {
    console.log(`User joined the chat 🤝. chatId: `, chatId);
    // joining the room with the chatId will allow specific events to be fired where we don't bother about the users like typing events
    // E.g. When user types we don't want to emit that event to specific participant.
    // We want to just emit that to the chat where the typing is happening
    socket.join(chatId);
  });
};

const mountParticipantTypingEvent = (socket: Socket) => {
  socket.on(ChatEventEnum.TYPING_EVENT, (chatId) => {
    socket.in(chatId).emit(ChatEventEnum.TYPING_EVENT, chatId);
  });
};

const mountParticipantStoppedTypingEvent = (socket: Socket) => {
  socket.on(ChatEventEnum.STOP_TYPING_EVENT, (chatId) => {
    socket.in(chatId).emit(ChatEventEnum.STOP_TYPING_EVENT, chatId);
  });
};

class MyCustomError extends Error {
  constructor(public customProperty: string) {
    super("This is a custom error message");
    this.name = "MyCustomError";
  }
}

const initializeSocketIO = (io: Server) => {
  return io.on("connection", async (socket) => {
    try {
      const cookies = cookie.parse(socket.handshake.headers?.cookie || "");

      let token = cookies?.accessToken;

      if (!token) {
        token = socket.handshake.auth?.token;
      }

      if (!token) {
        throw new ApiError(401, "Un-authorized handshake. Token is missing");
      }

      const decodedToken = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET as string
      ); 

      // const user = await User.findById(decodedToken?._id).select(
      //   "-password -refreshToken -emailVerificationToken -emailVerificationExpiry"
      // );

      // // retrieve the user
      // if (!user) {
      //   throw new ApiError(401, "Un-authorized handshake. Token is invalid");
      // }
      socket.user = "Hello boss"; // mount te user object to the socket

      // We are creating a room with user id so that if user is joined but does not have any active chat going on.
      // still we want to emit some socket events to the user.
      // so that the client can catch the event and show the notifications.
      // socket.join(user._id.toString());
      // socket.emit(ChatEventEnum.CONNECTED_EVENT); // emit the connected event so that client is aware
      // console.log("User connected 🗼. userId: ", user._id.toString());

      // Common events that needs to be mounted on the initialization
      mountJoinChatEvent(socket);
      mountParticipantTypingEvent(socket);
      mountParticipantStoppedTypingEvent(socket);

      // socket.on(ChatEventEnum.DISCONNECT_EVENT, () => {
      //   console.log("user has disconnected 🚫. userId: " + socket.user?._id);
      //   if (socket.user?._id) {
      //     socket.leave(socket.user._id);
      //   }
      // });
    } catch (error) {
      if (error instanceof MyCustomError) {
        console.error(error);
        socket.emit(
          ChatEventEnum.SOCKET_ERROR_EVENT,
          error?.message ||
            "Something went wrong while connecting to the socket."
        );
      } else {
        console.error("An unexpected error occurred");
        socket.emit(
          ChatEventEnum.SOCKET_ERROR_EVENT,
          "Something went wrong while connecting to the socket."
        );
      }
    }
  });
};

/**
 *
 * @param {import("express").Request} req - Request object to access the `io` instance set at the entry point
 * @param {string} roomId - Room where the event should be emitted
 * @param {AvailableChatEvents[0]} event - Event that should be emitted
 * @param {any} payload - Data that should be sent when emitting the event
 * @description Utility function responsible to abstract the logic of socket emission via the io instance
 */
const emitSocketEvent = (
  req: Request,
  roomId: string,
  event: string,
  payload: any
) => {
  req.app.get("io").in(roomId).emit(event, payload);
};

export { initializeSocketIO, emitSocketEvent };
