/* eslint-disable @typescript-eslint/no-unused-vars */
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useChatStore } from "@/lib/store/stateStore";
import { UserInterface } from "@/lib/types/chat";
import clsx from "clsx";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  createGroupChat,
  createUserChat,
  getAvailableUsers,
  getUserChats,
} from "@/lib/fetch";
import { fetcher } from "@/lib/hook/useUtility";
import { CircleX, Users } from "lucide-react";

export default function CreateChat() {
  const { toast } = useToast();
  const {
    isGroupChat,
    setIsGroupChat,
    creatingChat,
    setCreatingChat,
    setChats,
    setCreateChat,
  } = useChatStore();

  const [users, setUsers] = useState<UserInterface[]>([]);
  const [groupName, setGroupName] = useState("");
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
    // setIsGroupChat(false);
    setCreateChat();
  };

  useEffect(() => {
    getUsers();
    getChats();
  }, [creatingChat]);

  return (
    <div className="w-full">
      <div className="flex items-center gap-2">
        <Switch
          checked={isGroupChat}
          onCheckedChange={() => setIsGroupChat()}
        />
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

      <div className="my-2">
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
      </div>

      <div>
        <p>Not seeing the person?</p>
        <Button>Invite a user</Button>
      </div>

      {isGroupChat ? (
        <div className="my-5">
          <span
            className={clsx("font-medium text-white inline-flex items-center")}
          >
            <Users className="h-5 w-5 mr-2" /> Selected participants
          </span>{" "}
          <div className="flex justify-start items-center flex-wrap gap-2 mt-3">
            {users
              .filter((user) => groupParticipants.includes(user.id))
              ?.map((participant) => {
                return (
                  <div
                    className="inline-flex bg-secondary rounded-full p-2 border-[1px] border-zinc-400 items-center gap-2"
                    key={participant.id}
                  >
                    <p className="text-white">{participant.username}</p>
                    <CircleX
                      role="button"
                      className="w-6 h-6 hover:text-primary cursor-pointer"
                      onClick={() => {
                        setGroupParticipants(
                          groupParticipants.filter((p) => p !== participant.id)
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
  );
}
