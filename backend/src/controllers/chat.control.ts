import { Request, Response } from "express";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { prisma } from "../utils/client.js";
import { AuthErrorEnum, ChatEventEnum } from "../utils/constants.js";
import { ApiError } from "../utils/ApiError.js";
import { emitSocketEvent } from "../utils/socket.js";

// DONE:
const searchAvailableUsers = asyncHandler(
  async (req: Request, res: Response) => {
    const users = await prisma.user.findMany({
      where: {
        NOT: {
          id: req.user?.id,
        },
      },
    });

    if (!users) {
      console.log(
        "searchAvailableUsers - Users not available. Invite a new user instead."
      );
      return res
        .status(400)
        .json(
          new ApiResponse(
            400,
            AuthErrorEnum.USER_NOT_FOUND,
            "Users not available. Invite a new user instead."
          )
        );
    }

    return res
      .status(200)
      .json(new ApiResponse(200, users, "Users fetched successfully"));
  }
);

// DONE: closed route
const createOrGetAOneOnOneChat = asyncHandler(
  async (req: Request, res: Response) => {
    const { receiverId } = req.params;

    const receiver = await prisma.user.findUnique({
      where: {
        id: receiverId,
      },
    });

    if (!receiver) {
      throw new ApiError(400, "This user does not exist!");
    }

    if (receiver.id === req.user?.id) {
      throw new ApiError(400, "You cannot chat with yourself");
    }

    // Because of our multi chat system schema, we can't get sinle message between 2 users, so we get all messages they both feature in
    const chat = await prisma.chat.findMany({
      where: {
        isGroupGame: false,
        participants: {
          some: {
            id: req.user?.id,
          },
        },
        AND: [
          {
            participants: {
              some: {
                id: receiverId,
              },
            },
          },
        ],
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (chat.length) {
      // if we find the chat that means user already has created a chat
      return res
        .status(200)
        .json(new ApiResponse(200, chat, "Chat retrieved successfully"));
    }

    const newChatInstance = await prisma.chat.create({
      data: {
        name: "One on one chat",
        status: "started",
        isGroupGame: false,
        participants: {
          connect: [{ id: req.user?.id }, { id: receiverId }],
        },
      },
      include: {
        participants: true, // Include the players relation in the result
      },
    });

    if (!newChatInstance) {
      throw new ApiError(404, "Error while creating group chat.");
    }

    const chatSession = await prisma.chat.findUnique({
      where: {
        id: newChatInstance.id,
      },
      include: {
        participants: {
          select: {
            id: true,
            username: true,
            avatar: true,
            email: true,
          },
        },
        messages: {
          // Fetch the most recent message
          orderBy: {
            createdAt: "desc",
          },
          take: 5, // Limit to the most recent message
          select: {
            content: true,
            sender: {
              select: {
                username: true,
                avatar: true,
              },
            },
            createdAt: true,
          },
        },
      },
    });

    if (!chatSession) {
      throw new ApiError(500, "Internal server error");
    }

    newChatInstance.participants.forEach((participant) => {
      // if (player.id.toString() === req.user?.id.toString()) return;
      // don't emit the event for the logged in use as he is the one who is initiating the chat

      // emit event to other participants with new chat as a payload
      emitSocketEvent(
        req,
        participant.id?.toString(),
        ChatEventEnum.NEW_CHAT_EVENT,
        chatSession
      );
    });

    return res
      .status(201)
      .json(new ApiResponse(201, chatSession, "Chat retrieved successfully"));
  }
);

// DONE:
const createAGroupChat = asyncHandler(async (req: Request, res: Response) => {
  const { name, participants } = req.body;

  if (participants.includes(req.user?.id)) {
    throw new ApiError(
      400,
      "Participants array should not contain the group creator"
    );
  }

  const members = [...new Set([...participants, req.user?.id])];

  if (members.length < 3) {
    // We want group chat to have minimum 3 members including admin
    throw new ApiError(400, "Group chat must have a minimum of 3 members.");
  }

  const newChatInstance = await prisma.chat.create({
    data: {
      name: name,
      status: "started",
      participants: {
        connect: members.map((participant: string) => ({
          id: participant,
        })),
      },
    },
    include: {
      participants: true,
    },
  });

  if (!newChatInstance) {
    throw new ApiError(404, "Error while creating group chat.");
  }

  const chatSession = await prisma.chat.findUnique({
    where: {
      id: newChatInstance.id,
    },
    include: {
      participants: {
        select: {
          id: true,
          username: true,
          avatar: true,
          email: true,
        },
      },
      messages: {
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
        select: {
          content: true,
          sender: {
            select: {
              username: true,
              avatar: true,
            },
          },
          createdAt: true,
        },
      },
    },
  });

  if (!chatSession) {
    throw new ApiError(500, "Internal server error");
  }

  newChatInstance.participants.forEach((participant) => {
    // if (player.id.toString() === req.user?.id.toString()) return;

    // emit event to other participants with new chat as a payload
    emitSocketEvent(
      req,
      participant.id?.toString(),
      ChatEventEnum.NEW_CHAT_EVENT,
      chatSession
    );
  });

  return res
    .status(200)
    .json(new ApiResponse(201, chatSession, "Group chat created successfully"));
});

// DONE:
const getGroupChatDetails = asyncHandler(
  async (req: Request, res: Response) => {
    const { chatId } = req.params;

    const chat = await prisma.chat.findUnique({
      where: {
        id: chatId,
      },
      include: {
        participants: {
          // Participants in the session
          select: {
            id: true,
            username: true,
            avatar: true,
            email: true,
          },
        },
        messages: {
          // Fetch the most recent message
          orderBy: {
            createdAt: "desc",
          },
          take: 5, // Limit to the most recent message
          select: {
            content: true,
            sender: {
              select: {
                username: true,
                avatar: true,
              },
            },
            createdAt: true,
          },
        },
      },
    });

    if (!chat) {
      throw new ApiError(404, "Group chat does not exist");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, chat, "Group chat fetched successfully"));
  }
);

// DONE:
const renameGroupChat = asyncHandler(async (req: Request, res: Response) => {
  const { chatId } = req.params;
  const { name } = req.body;

  const groupChat = await prisma.chat.findUnique({
    where: {
      id: chatId,
      isGroupGame: true,
    },
  });

  if (!groupChat) {
    throw new ApiError(404, "Group chat does not exist");
  }

  // // only admin can change the name
  // if (groupChat.admin?.toString() !== req.user._id?.toString()) {
  //   throw new ApiError(404, "You are not an admin");
  // }

  const updatedGroupChat = await prisma.chat.update({
    where: {
      id: chatId,
    },
    data: {
      name: name,
    },
    include: {
      participants: {
        select: {
          id: true,
          username: true,
          avatar: true,
          email: true,
        },
      },
      messages: {
        // Fetch the most recent message
        orderBy: {
          createdAt: "desc",
        },
        take: 5, // Limit to the most recent message
        select: {
          content: true,
          sender: {
            select: {
              username: true,
              avatar: true,
            },
          },
          createdAt: true,
        },
      },
    },
  });

  if (!updatedGroupChat) {
    throw new ApiError(500, "Internal server error");
  }

  updatedGroupChat.participants.forEach((participant) => {
    // if (player.id.toString() === req.user?.id.toString()) return;

    // emit event to other participants with new chat as a payload
    emitSocketEvent(
      req,
      participant.id?.toString(),
      ChatEventEnum.UPDATE_GROUP_NAME_EVENT,
      updatedGroupChat
    );
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedGroupChat,
        "Group chat name updated successfully"
      )
    );
});

// WARN: //DONE:
const deleteGroupChat = asyncHandler(async (req: Request, res: Response) => {
  const { chatId } = req.params;

  const groupChat = await prisma.chat.findUnique({
    where: {
      id: chatId,
      isGroupGame: true,
    },
  });

  if (!groupChat) {
    throw new ApiError(404, "Group chat does not exist");
  }

  // // only admin can change the name
  // if (groupChat.admin?.toString() !== req.user._id?.toString()) {
  //   throw new ApiError(404, "You are not an admin");
  // }

  const deletedGroupChat = await prisma.chat.delete({
    where: {
      id: chatId,
    },
    include: {
      participants: {
        select: {
          id: true,
          username: true,
          avatar: true,
          email: true,
        },
      },
    },
  });

  if (!deletedGroupChat) {
    throw new ApiError(500, "Internal server error");
  }

  deletedGroupChat.participants.forEach((participant) => {
    // if (player.id.toString() === req.user?.id.toString()) return;

    // emit event to other participants with new chat as a payload
    emitSocketEvent(
      req,
      participant.id?.toString(),
      ChatEventEnum.LEAVE_CHAT_EVENT,
      deletedGroupChat
    );
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Group chat deleted successfully"));
});

// DONE:
const deleteOneOnOneChat = asyncHandler(async (req: Request, res: Response) => {
  const { chatId } = req.params;

  const chat = await prisma.chat.findUnique({
    where: {
      id: chatId,
      isGroupGame: false,
    },
  });

  if (!chat) {
    throw new ApiError(404, "Chat does not exist");
  }

  const deletedChat = await prisma.chat.delete({
    where: {
      id: chatId,
    },
    include: {
      participants: {
        select: {
          id: true,
          username: true,
          avatar: true,
          email: true,
        },
      },
    },
  });

  if (!deletedChat) {
    throw new ApiError(500, "Internal server error");
  }

  deletedChat.participants.forEach((participant) => {
    // if (player.id.toString() === req.user?.id.toString()) return;

    // emit event to other participants with new chat as a payload
    emitSocketEvent(
      req,
      participant.id?.toString(),
      ChatEventEnum.LEAVE_CHAT_EVENT,
      deletedChat
    );
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Chat deleted successfully"));
});

// DONE:
const leaveGroupChat = asyncHandler(async (req: Request, res: Response) => {
  const { chatId } = req.params;

  const chat = await prisma.chat.findUnique({
    where: {
      id: chatId,
      isGroupGame: true,
    },
    include: {
      participants: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!chat) {
    throw new ApiError(404, "Group chat does not exist");
  }

  const notAParticipant = chat.participants.filter(
    (participant) => participant.id !== req.user?.id
  );

  if (notAParticipant) {
    throw new ApiError(400, "You are not a part of this group chat");
  }

  const updatedChat = await prisma.chat.update({
    where: {
      id: chatId,
    },
    data: {
      participants: {
        disconnect: {
          id: req.user?.id,
        },
      },
    },
    include: {
      participants: {
        select: {
          id: true,
          username: true,
          avatar: true,
          email: true,
        },
      },
    },
  });

  if (!updatedChat) {
    throw new ApiError(500, "Internal server error");
  }

  updatedChat.participants.forEach((participant) => {
    // if (player.id.toString() === req.user?.id.toString()) return;

    emitSocketEvent(
      req,
      participant.id?.toString(),
      ChatEventEnum.LEAVE_CHAT_EVENT,
      updatedChat
    );
  });

  return res
    .status(200)
    .json(new ApiResponse(200, updatedChat, "Left a group successfully"));
});

// DONE:
const addNewParticipantInGroupChat = asyncHandler(
  async (req: Request, res: Response) => {
    const { chatId, participantId } = req.params;

    const chat = await prisma.chat.findUnique({
      where: {
        id: chatId,
        isGroupGame: true,
      },
      include: {
        participants: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!chat) {
      throw new ApiError(404, "Group chat does not exist");
    }

    // // check if user who is adding is a group admin
    // if (groupChat.admin?.toString() !== req.user._id?.toString()) {
    //   throw new ApiError(404, "You are not an admin");
    // }

    const alreadyAParticipant = chat.participants.filter(
      (participant) => participant.id === participantId
    );

    if (alreadyAParticipant) {
      throw new ApiError(400, "Player already in a group chat");
    }

    const updatedChat = await prisma.chat.update({
      where: {
        id: chatId,
      },
      data: {
        participants: {
          connect: {
            id: participantId,
          },
        },
      },
      include: {
        participants: {
          select: {
            id: true,
            username: true,
            avatar: true,
            email: true,
          },
        },
      },
    });

    if (!updatedChat) {
      throw new ApiError(500, "Internal server error");
    }

    updatedChat.participants.forEach((participant) => {
      emitSocketEvent(
        req,
        participant.id?.toString(),
        ChatEventEnum.JOIN_CHAT_EVENT,
        updatedChat
      );
    });

    return res
      .status(200)
      .json(new ApiResponse(200, updatedChat, "Player added successfully"));
  }
);

// DONE:
const removeParticipantFromGroupChat = asyncHandler(
  async (req: Request, res: Response) => {
    const { chatId, participantId } = req.params;

    const chat = await prisma.chat.findUnique({
      where: {
        id: chatId,
        isGroupGame: true,
      },
      include: {
        participants: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!chat) {
      throw new ApiError(404, "Group chat does not exist");
    }

    // // check if user who is adding is a group admin
    // if (groupChat.admin?.toString() !== req.user._id?.toString()) {
    //   throw new ApiError(404, "You are not an admin");
    // }

    const notAParticipant = chat.participants.filter(
      (participant) => participant.id !== participantId
    );

    if (notAParticipant) {
      throw new ApiError(400, "Player does not exist in the group chat");
    }

    const updatedChat = await prisma.chat.update({
      where: {
        id: chatId,
      },
      data: {
        participants: {
          disconnect: {
            id: participantId,
          },
        },
      },
      include: {
        participants: {
          select: {
            id: true,
            username: true,
            avatar: true,
            email: true,
          },
        },
      },
    });

    if (!updatedChat) {
      throw new ApiError(500, "Internal server error");
    }

    // emit leave chat event to the removed participant only
    // emitSocketEvent(req, participantId, ChatEventEnum.LEAVE_CHAT_EVENT, payload);

    updatedChat.participants.forEach((participant) => {
      emitSocketEvent(
        req,
        participant.id?.toString(),
        ChatEventEnum.LEAVE_CHAT_EVENT,
        updatedChat
      );
    });

    return res
      .status(200)
      .json(new ApiResponse(200, updatedChat, "Player removed successfully"));
  }
);

// DONE:
const getAllChats = asyncHandler(async (req: Request, res: Response) => {
  // get all chats that have logged in user as a participant

  const chats = await prisma.chat.findMany({
    where: {
      participants: {
        some: {
          id: req.user?.id,
        },
      },
    },
    include: {
      participants: {
        select: {
          id: true,
          avatarId: true,
          email: true,
          username: true,
        },
      },
      messages: true,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, chats, "User chats fetched successfully!"));
});

export {
  searchAvailableUsers,
  createOrGetAOneOnOneChat,
  createAGroupChat,
  getGroupChatDetails,
  renameGroupChat,
  deleteGroupChat,
  deleteOneOnOneChat,
  leaveGroupChat,
  addNewParticipantInGroupChat,
  removeParticipantFromGroupChat,
  getAllChats,
};
