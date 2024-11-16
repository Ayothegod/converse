/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useToast } from "@/hooks/use-toast";
// import { useSocket } from "@/lib/context/useSocketContext";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  createGroupChat,
  createUserChat,
  getAvailableUsers,
  getUserChats,
} from "@/lib/fetch";
import { fetcher } from "@/lib/hook/useUtility";
import { UserInterface } from "@/lib/types/chat";
import clsx from "clsx";
import { CircleAlert, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useChatStore } from "@/lib/store/stateStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Side() {
  // const { socket } = useSocket();
  const { allChats, setChats, creatingChat, setCreatingChat } = useChatStore();
  const { toast } = useToast();
  // console.log(socket);
  const [users, setUsers] = useState<UserInterface[]>([]);
  const [groupName, setGroupName] = useState("");
  const [isGroupChat, setIsGroupChat] = useState(true);
  const [groupParticipants, setGroupParticipants] = useState<string[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<null | string>(null);
  // const [creatingChat, setCreatingChat] = useState(false);

  // DONE:
  const getUsers = async () => {
    const { error, data } = await fetcher(
      async () => await getAvailableUsers()
    );
    if (error) {
      return toast({
        description: `${error}`,
        variant: "destructive",
      });
    }
    // console.log(data?.data);
    setUsers(data?.data || null);
  };

  // DONE:
  const getChats = async () => {
    const { error, data } = await fetcher(async () => await getUserChats());

    if (error) {
      return toast({
        description: `${error}`,
        variant: "destructive",
      });
    }
    // console.log("All user chat:", data?.data);
    setChats("updateChat", undefined, data?.data);
  };

  // PENDING:
  const createNewChat = async () => {
    if (!selectedUserId)
      return toast({
        description: `Please select a user`,
        variant: "destructive",
      });

    setCreatingChat();
    const { error, data } = await fetcher(
      async () => await createUserChat(selectedUserId)
    );

    if (error) {
      return toast({
        description: `${error}`,
        variant: "destructive",
      });
    }

    if (data?.statusCode === 200) {
      return toast({
        description: `Chat with selected user already exists`,
        variant: "destructive",
      });
    }

    setChats("addChat", data?.data);
    setCreatingChat();
  };

  // DONE:
  const createNewGroupChat = async () => {
    if (!groupName)
      return toast({
        description: `Group name is required`,
        variant: "destructive",
      });

    if (!groupParticipants.length || groupParticipants.length < 2)
      return toast({
        description: "There must be at least 2 group participants",
        variant: "destructive",
      });

    setCreatingChat();
    const { error, data } = await fetcher(
      async () =>
        await createGroupChat({
          name: groupName,
          participants: groupParticipants,
        })
    );

    if (error) {
      return toast({
        description: `${error}`,
        variant: "destructive",
      });
    }

    setChats("addChat", data?.data);
    setCreatingChat();
  };

  const handleClose = () => {
    setUsers([]);
    setSelectedUserId("");
    setGroupName("");
    setGroupParticipants([]);
    setIsGroupChat(false);
  };

  useEffect(() => {
    getUsers();
    getChats();
  }, [creatingChat]);

  return (
    <div className="w-[14em] sm:w-[16em] p-3 md:w-[22em] border min-h-screen bg-background-top flex-shrink-0">
      {/* Header */}
      <div>
        <div className="flex justify-between items-center">
          <h1 className="text-lg font-semibold leading-6 text-white">
            Create chat
          </h1>
          <button
            type="button"
            className="rounded-md bg-transparent text-zinc-400 hover:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-white focus:ring-offset-2"
            // onClick={() => handleClose()}
          >
            Close
          </button>
        </div>
      </div>

      <div className="my-4">
        <div className="flex items-center gap-2">
          <Switch checked={isGroupChat} onCheckedChange={setIsGroupChat} />
          <div className="ml-3 text-sm">
            <span
              className={clsx(
                "font-medium text-white",
                isGroupChat ? "" : "opacity-40"
              )}
            >
              Is it a group chat?
            </span>{" "}
          </div>
        </div>

        {isGroupChat ? (
          <div className="my-5">
            <Input
              placeholder={"Enter a group name..."}
              value={groupName}
              onChange={(e) => {
                setGroupName(e.target.value);
              }}
            />
          </div>
        ) : null}

        <Select
          onValueChange={(value) => {
            if (isGroupChat && !groupParticipants.includes(value)) {
              setGroupParticipants([...groupParticipants, value]);
            } else {
              setSelectedUserId(value);
            }
          }}
          defaultValue={isGroupChat ? "" : selectedUserId || ""}
        >
          <SelectTrigger className="w-full">
            <SelectValue
              placeholder={
                isGroupChat
                  ? "Select group participants..."
                  : "Select a user to chat..."
              }
            />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Users</SelectLabel>
              {users.map((user) => (
                <SelectItem value={user.id} key={user.id}>
                  {user.username}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        {isGroupChat ? (
          <div className="my-5">
            <span
              className={clsx(
                "font-medium text-white inline-flex items-center"
              )}
            >
              <Users className="h-5 w-5 mr-2" /> Selected participants
            </span>{" "}
            <div className="flex justify-start items-center flex-wrap gap-2 mt-3">
              {users
                .filter((user) => groupParticipants.includes(user.id))
                ?.map((participant) => {
                  // console.log(participant.username);

                  return (
                    <div
                      className="inline-flex bg-secondary rounded-full p-2 border-[1px] border-zinc-400 items-center gap-2"
                      key={participant.id}
                    >
                      <p className="text-white">{participant.username}</p>
                      <CircleAlert
                        role="button"
                        className="w-6 h-6 hover:text-primary cursor-pointer"
                        onClick={() => {
                          setGroupParticipants(
                            groupParticipants.filter(
                              (p) => p !== participant.id
                            )
                          );
                        }}
                      />
                    </div>
                  );
                })}
            </div>
          </div>
        ) : null}

        <div className="mt-5 flex justify-between items-center gap-4">
          <Button
            disabled={creatingChat}
            variant={"secondary"}
            onClick={handleClose}
            className="w-1/2"
          >
            Cancel
          </Button>
          <Button
            disabled={creatingChat}
            onClick={isGroupChat ? createNewGroupChat : createNewChat}
            className="w-1/2"
          >
            Create
          </Button>
        </div>
      </div>
    </div>
  );
}
