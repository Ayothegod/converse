/* eslint-disable @typescript-eslint/no-unused-vars */
import CustomLabel from "@/components/build/CustomLabel";
import { ChatItem } from "@/components/sections/chat/ChatItem";
import CreateChat from "@/components/sections/chat/CreateChat";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useSocket } from "@/lib/context/useSocketContext";
import { ChatEvent } from "@/lib/db";
import { getChatMessages, getUserChats } from "@/lib/fetch";
import { fetcher, LocalStorage } from "@/lib/hook/useUtility";
import { useChatStore } from "@/lib/store/stateStore";
import { ChatListItemInterface, ChatMessageInterface } from "@/lib/types/chat";
import { MessagesSquare, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function Chats() {
  const { createChat, setCreateChat, allChats,setChats } = useChatStore();

  const { socket } = useSocket();
  const { toast } = useToast();

  const currentChat = useRef<ChatListItemInterface | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [isConnected, setIsConnected] = useState(false);
  const [loadingChats, setLoadingChats] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const [messages, setMessages] = useState<ChatMessageInterface[]>([]);
  const [unreadMessages, setUnreadMessages] = useState<ChatMessageInterface[]>(
    []
  );

  const [isTyping, setIsTyping] = useState(false);
  const [selfTyping, setSelfTyping] = useState(false);

  const [message, setMessage] = useState("");
  // const [localSearchQuery, setLocalSearchQuery] = useState("");

  // DONE:
  const updateChatLastMessage = (
    chatToUpdateId: string,
    message: ChatMessageInterface
  ) => {
    const chatToUpdate = allChats.find((chat) => chat.id === chatToUpdateId)!;

    chatToUpdate.lastMessage = message;

    chatToUpdate.updatedAt = message?.updatedAt;

    setChats("updateChatLastMessage", chatToUpdate);
  };

  // DONE:
  const updateChatLastMessageOnDeletion = async (
    chatToUpdateId: string, //ChatId to find the chat
    message: ChatMessageInterface //The deleted message
  ) => {
    const chatToUpdate = allChats.find((chat) => chat.id === chatToUpdateId)!;

    if (chatToUpdate.lastMessage?.id === message.id) {
      const { error, isLoading, data } = await fetcher(
        async () => await getChatMessages(chatToUpdateId)
      );

      if (error) {
        return toast({
          description: `${error}`,
          variant: "destructive",
        });
      }

      setLoadingChats(isLoading);
      chatToUpdate.lastMessage = data?.data;
      setChats("updateChat", ...allChats);
    }
  };

  // DONE:
  const getChats = async () => {
    const { error, data, isLoading } = await fetcher(
      async () => await getUserChats()
    );

    if (error) {
      return toast({
        description: `${error}`,
        variant: "destructive",
      });
    }
    setLoadingChats(isLoading);
    // console.log("All user chat:", data?.data);
    setChats("updateChat", undefined, data?.data);
  };

  // DONE:
  const getMessages = async () => {
    if (!currentChat.current?.id)
      return toast({
        description: `No chat is selected`,
        variant: "destructive",
      });

    if (!socket)
      return toast({
        description: `Socket not available`,
        variant: "destructive",
      });

    // Emit an event to join the current chat
    socket.emit(ChatEvent.JOIN_CHAT_EVENT, currentChat.current?.id);

    setUnreadMessages(
      unreadMessages.filter((msg) => msg.chat !== currentChat.current?.id)
    );

    // Make an async request to fetch chat messages for the current chat
    setLoadingMessages(true);
    const { error, isLoading, data } = await fetcher(
      async () => await getChatMessages(currentChat.current?.id || "")
    );
    setLoadingMessages(false);

    if (error) {
      return toast({
        description: `${error}`,
        variant: "destructive",
      });
    }
    setMessages(data?.data || []);
  };

  // PENDING:
  const sendChatMessage = async () => {
    if (!currentChat.current?.id || !socket) return;

    // Emit a STOP_TYPING_EVENT to inform other users/participants that typing has stopped
    socket.emit(ChatEvent.STOP_TYPING_EVENT, currentChat.current?.id);

    // Use the requestHandler to send the message and handle potential response or error
    // await requestHandler(
    //   // Try to send the chat message with the given message and attached files
    //   async () =>
    //     await sendMessage(
    //       currentChat.current?._id || "", // Chat ID or empty string if not available
    //       message, // Actual text message
    //       attachedFiles // Any attached files
    //     ),
    //   null,
    //   // On successful message sending, clear the message input and attached files, then update the UI
    //   (res) => {
    //     setMessage(""); // Clear the message input
    //     setAttachedFiles([]); // Clear the list of attached files
    //     setMessages((prev) => [res.data, ...prev]); // Update messages in the UI
    //     updateChatLastMessage(currentChat.current?._id || "", res.data); // Update the last message in the chat
    //   },

    //   // If there's an error during the message sending process, raise an alert
    //   alert
    // );
  };

  // PENDING:
  const deleteChatMessage = async (message: ChatMessageInterface) => {
    //ONClick delete the message and reload the chat when deleteMessage socket gives any response in chat.tsx
    //use request handler to prevent any errors
    // await requestHandler(
    //   async () => await deleteMessage(message.chat, message._id),
    //   null,
    //   (res) => {
    //     setMessages((prev) => prev.filter((msg) => msg._id !== res.data._id));
    //     updateChatLastMessageOnDeletion(message.chat, message);
    //   },
    //   alert
    // );
  };

  // PENDING:
  const handleOnMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Update the message state with the current input value
    setMessage(e.target.value);

    // If socket doesn't exist or isn't connected, exit the function
    if (!socket || !isConnected) return;

    // Check if the user isn't already set as typing
    if (!selfTyping) {
      // Set the user as typing
      setSelfTyping(true);

      // Emit a typing event to the server for the current chat
      socket.emit(ChatEvent.TYPING_EVENT, currentChat.current?.id);
    }

    // Clear the previous timeout (if exists) to avoid multiple setTimeouts from running
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Define a length of time (in milliseconds) for the typing timeout
    const timerLength = 3000;

    // Set a timeout to stop the typing indication after the timerLength has passed
    typingTimeoutRef.current = setTimeout(() => {
      // Emit a stop typing event to the server for the current chat
      socket.emit(ChatEvent.STOP_TYPING_EVENT, currentChat.current?.id);

      // Reset the user's typing state
      setSelfTyping(false);
    }, timerLength);
  };

  // DONE:
  const onConnect = () => {
    setIsConnected(true);
  };

  // DONE:
  const onDisconnect = () => {
    setIsConnected(false);
  };

  // DONE:
  const handleOnSocketTyping = (chatId: string) => {
    if (chatId !== currentChat.current?.id) return;
    setIsTyping(true);
  };

  // DONE:
  const handleOnSocketStopTyping = (chatId: string) => {
    if (chatId !== currentChat.current?.id) return;
    setIsTyping(false);
  };

  // DONE:
  const onMessageDelete = (message: ChatMessageInterface) => {
    if (message?.chat !== currentChat.current?.id) {
      setUnreadMessages((prev) => prev.filter((msg) => msg.id !== message.id));
    } else {
      setMessages((prev) => prev.filter((msg) => msg.id !== message.id));
    }

    updateChatLastMessageOnDeletion(message.chat, message);
  };

  // DONE:
  const onMessageReceived = (message: ChatMessageInterface) => {
    // Check if the received message belongs to the currently active chat
    if (message?.chat !== currentChat.current?.id) {
      // If not, update the list of unread messages
      setUnreadMessages((prev) => [message, ...prev]);
    } else {
      // If it belongs to the current chat, update the messages list for the active chat
      setMessages((prev) => [message, ...prev]);
    }

    updateChatLastMessage(message.chat || "", message);
  };

  // DONE:
  const onNewChat = (chat: ChatListItemInterface) => {
    // console.log("New chat", chat);

    setChats("addChat", chat);
  };

  // DONE:
  const onChatLeave = (chat: ChatListItemInterface) => {
    if (chat.id === currentChat.current?.id) {
      currentChat.current = null;
      LocalStorage.remove("currentChat");
    }

    setChats("filterChat", chat);
  };

  // DONE:
  const onGroupNameChange = (chat: ChatListItemInterface) => {
    if (chat.id === currentChat.current?.id) {
      currentChat.current = chat;

      // Save the updated chat details to local storage
      LocalStorage.set("currentChat", chat);
    }

    setChats("groupNameChange", chat);
  };

  useEffect(() => {
    getChats();

    // Retrieve the current chat details from local storage.
    const _currentChat = LocalStorage.get("currentChat");

    // If there's a current chat saved in local storage:
    if (_currentChat) {
      console.log("Current chat: ", _currentChat);

      // Set the current chat reference to the one from local storage.
      currentChat.current = _currentChat;
      // If the socket connection exists, emit an event to join the specific chat using its ID.
      socket?.emit(ChatEvent.JOIN_CHAT_EVENT, _currentChat.current?._id);
      // Fetch the messages for the current chat.
      // getMessages();
    }
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on(ChatEvent.CONNECTED_EVENT, onConnect);
    socket.on(ChatEvent.DISCONNECT_EVENT, onDisconnect);
    socket.on(ChatEvent.TYPING_EVENT, handleOnSocketTyping);
    socket.on(ChatEvent.STOP_TYPING_EVENT, handleOnSocketStopTyping);
    socket.on(ChatEvent.MESSAGE_RECEIVED_EVENT, onMessageReceived);
    socket.on(ChatEvent.NEW_CHAT_EVENT, onNewChat);
    socket.on(ChatEvent.LEAVE_CHAT_EVENT, onChatLeave);
    socket.on(ChatEvent.UPDATE_GROUP_NAME_EVENT, onGroupNameChange);
    socket.on(ChatEvent.MESSAGE_DELETE_EVENT, onMessageDelete);
    return () => {
      socket.off(ChatEvent.CONNECTED_EVENT, onConnect);
      socket.off(ChatEvent.DISCONNECT_EVENT, onDisconnect);
      socket.off(ChatEvent.TYPING_EVENT, handleOnSocketTyping);
      socket.off(ChatEvent.STOP_TYPING_EVENT, handleOnSocketStopTyping);
      socket.off(ChatEvent.MESSAGE_RECEIVED_EVENT, onMessageReceived);
      socket.off(ChatEvent.NEW_CHAT_EVENT, onNewChat);
      socket.off(ChatEvent.LEAVE_CHAT_EVENT, onChatLeave);
      socket.off(ChatEvent.UPDATE_GROUP_NAME_EVENT, onGroupNameChange);
      socket.off(ChatEvent.MESSAGE_DELETE_EVENT, onMessageDelete);
    };
  }, [socket, allChats]);

  const startCreateChat = () => {
    setCreateChat();
  };
  console.log(allChats);
  return (
    <div className="min-h-screen flex full">
      {/* PENDING: */}
      <div className="w-full sm:w-[18em] p-3 md:w-[20em] lg:w-[24em] border  min-h-screen flex-shrink-0 flex flex-col gap-4">
        <div>
          <h1 className="text-2xl text-white font-semibold">Chats</h1>
        </div>

        <div className="relative">
          <Search className="h-4 w-4 absolute top-2" />
          <input
            type="text"
            className="w-full bg-transparent border border-white/10 rounded-md h-10 outline-none focus:ring-2 focus:ring-background-top"
          />
        </div>

        <div className="">
          <div className="h-full ">
            {!allChats.length ? (
              <div className="w-full flex flex-col items-center justify-center text-center mt-10 ">
                {createChat ? (
                  <CreateChat />
                ) : (
                  <div className="flex flex-col gap-2 items-center">
                    <p className="text-sm font-semibold">
                      You don't have any active chats yet
                    </p>

                    <Button onClick={startCreateChat}>Get started</Button>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <CustomLabel>
                  <MessagesSquare className="h-4 w-4" /> All Chats
                </CustomLabel>
                {[...allChats].map((chat) => (
                  <ChatItem
                    chat={chat}
                    isActive={chat.id === currentChat.current?.id}
                    unreadCount={
                      unreadMessages.filter((n) => n.chat === chat.id).length
                    }
                    onClick={(chat) => {
                      if (
                        currentChat.current?.id &&
                        currentChat.current?.id === chat.id
                      )
                        return;
                      LocalStorage.set("currentChat", chat);
                      currentChat.current = chat;
                      setMessage("");
                      // getMessages();
                    }}
                    key={chat.id}
                    onChatDelete={(chatId) => {
                      setChats("filterChat", undefined, undefined, chatId);
                      if (currentChat.current?.id === chatId) {
                        currentChat.current = null;
                        LocalStorage.remove("currentChat");
                      }
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* <div className="bg-primary p-3 rounded-full text-white w-max shadow-sm cursor-pointer">
                  <Plus className="h-5 w-5" />
                </div> */}

      {/* PENDING: chats page here */}
      <div className="hidden sm:flex min-h-screen flex-shrink-0 flex-grow">
        <div>
          <Button>Hello</Button>
        </div>
      </div>
    </div>
  );
}
