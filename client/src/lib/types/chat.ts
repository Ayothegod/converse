/* eslint-disable @typescript-eslint/no-explicit-any */
export interface UserInterface {
  id: string;
  avatarId: string | null;
  username: string;
  email: string;
}

export interface APIStatusResponseInterface {
  data: any;
  message: string;
  statusCode: number;
  success?: boolean;
}

export interface ChatListItemInterface {
  id: string;
  gameType: string
  status: boolean
  createdAt: Date
  name: string;
  isGroupGame: boolean;

  lastMessage?: ChatMessageInterface
  messages: ChatMessageInterface[]
  players: UserInterface[];
  updatedAt: string;
}

export interface ChatMessageInterface {
  id: string;
  sender: Pick<UserInterface, "id" | "avatarId" | "email" | "username">;
  content: string;
  chat: string;
  attachments: {
    url: string;
    id: string;
  }[];
  createdAt: string;
  updatedAt: string;
}
