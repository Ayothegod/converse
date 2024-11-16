import CustomLabel from "@/components/build/CustomLabel";
import CreateChat from "@/components/sections/chat/CreateChat";
import { Button } from "@/components/ui/button";
import { useChatStore } from "@/lib/store/stateStore";
import { MessagesSquare, Plus, Search } from "lucide-react";

// on client -> as a user that wants to chat
// -> search available user
// if user () => send welcome message and also invite
// if accepted () => start chatting
// if !user or !ourFriend () => invite user

export default function Chats() {
  const { createChat, setCreateChat } = useChatStore();
  const chats = [];
  console.log(createChat, setCreateChat);
  
  const startCreateChat = () => {
    setCreateChat()
  }

  return (
    <div className="min-h-screen flex full border border-blue-500 ">
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
          <CustomLabel>
            <MessagesSquare className="h-4 w-4" /> All Chats
          </CustomLabel>

          <div className="h-full flex flex-col items-center justify-center text-center mt-10 ">
            {chats.length < 1 ? (
              <div>
                <p className="text-sm font-semibold">
                  You don't have any active chats yet
                </p>
                <Button onClick={startCreateChat}>Get started</Button>

                {createChat && <CreateChat/>}
              </div>
            ) : (
              <div>
                <p>Get started</p>
                <div className="bg-primary p-3 rounded-full text-white w-max shadow-sm cursor-pointer">
                  <Plus className="h-5 w-5" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PENDING: chats page here */}
      <div className="hidden sm:flex border min-h-screen flex-shrink-0 border-red-700 flex-grow">
        <div>
          <Button>Hello</Button>
        </div>
      </div>
    </div>
  );
}
