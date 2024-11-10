// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { useSocket } from "@/lib/context/useSocketContext";
// import  { useState, useEffect } from "react";

// export default function Chat() {
//   const { socket } = useSocket();

//   const [isConnected, setIsConnected] = useState(socket?.connected);
//   const [lastMessage, setLastMessage] = useState(null);

//   useEffect(() => {
//     socket?.on("connected", (data: string) => {
//       console.log(data);
//       setIsConnected(true);
//     });
//     socket?.on("disconnect", () => {
//       setIsConnected(false);
//     });
//     socket?.on("message", (data: any) => {
//       console.log(data);
//       setLastMessage(data);
//     });
//     return () => {
//       socket?.off("connect");
//       socket?.off("disconnect");
//       socket?.off("message");
//     };
//   });

//   const sendMessage = () => {
//     console.log("Start hello");
//     socket?.emit("hello!");
//   };

//   return (
//     <div className="App">
//       <header className="App-header">
//         Socket page
//         <p>Connected: {"" + isConnected}</p>
//         <p>Last message: {lastMessage || "-"}</p>
//         <button onClick={sendMessage}>Say hello!</button>
//       </header>
//     </div>
//   );
// }

// TODO: next
/* eslint-disable @typescript-eslint/no-explicit-any */
// import { Button } from "@/components/ui/button";
// import { useSocket } from "@/lib/context/useSocketContext";
// import { useState, useEffect } from "react";

// export default function Chat() {
//   const { socket } = useSocket();

//   const [isConnected, setIsConnected] = useState(socket?.connected);
//   const [lastMessage, setLastMessage] = useState<string | null>(null);
//   const [isTyping, setIsTyping] = useState(false);

//   const chatId = "some-chat-id"; // Replace with actual chat ID

//   useEffect(() => {
//     // Event for connection confirmation
//     socket?.on("connected", (data: string) => {
//       console.log(data);
//       setIsConnected(true);
//     });

//     // Event for disconnection
//     socket?.on("disconnect", () => {
//       setIsConnected(false);
//       console.log("Disconnected from server");
//     });

//     // Error handling
//     socket?.on("socketError", (errorMessage: string) => {
//       console.error("Socket error:", errorMessage);
//       setLastMessage(`Error: ${errorMessage}`);
//     });

//     // Listening for join chat confirmation
//     socket?.on("joinedChat", (data: any) => {
//       console.log("Joined chat:", data);
//       setLastMessage("Successfully joined chat");
//     });

//     // Typing event listener
//     socket?.on("typing", () => {
//       setIsTyping(true);
//     });

//     // Stop typing event listener
//     socket?.on("stopTyping", () => {
//       setIsTyping(false);
//     });

//     return () => {
//       // Clean up listeners on component unmount
//       socket?.off("connected");
//       socket?.off("disconnect");
//       socket?.off("socketError");
//       socket?.off("joinedChat");
//       socket?.off("typing");
//       socket?.off("stopTyping");
//     };
//   }, [socket]);

//   // Function to join a chat
//   const joinChat = () => {
//     socket?.emit("joinChat", chatId);
//   };

//   // Function to indicate typing
//   const startTyping = () => {
//     socket?.emit("typing", chatId);
//   };

//   // Function to stop typing
//   const stopTyping = () => {
//     socket?.emit("stopTyping", chatId);
//   };

//   // Message sending function
//   const sendMessage = () => {
//     socket?.emit("message", "Hello, chat!");
//   };

//   return (
//     <div className="App">
//       <header className="App-header">
//         <h1>Socket.IO Chat</h1>
//         <p>Connected: {isConnected ? "Yes" : "No"}</p>
//         <p>Last message: {lastMessage || "-"}</p>
//         <p>Typing: {isTyping ? "Someone is typing..." : "No one is typing"}</p>

//         <Button onClick={joinChat}>Join Chat</Button>
//         <Button onClick={sendMessage}>Send Message</Button>
//         <Button onMouseDown={startTyping} onMouseUp={stopTyping}>
//           Type Message
//         </Button>
//       </header>
//     </div>
//   );
// }

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { useSocket } from "@/lib/context/useSocketContext";
import { useState, useEffect } from "react";

type Message = {
  user: string;
  message: string;
};

export default function Chat() {
  const { socket } = useSocket();

  const [isConnected, setIsConnected] = useState(socket?.connected);
  const [userSocket, setUserSocket] = useState("");

  const [lastMessage, setLastMessage] = useState<string | null>(null);
  const [chatId, setChatId] = useState("");
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);

  useEffect(() => {
    // Connection event listener
    socket?.on("connected", (data: string) => {
      console.log(data);
      setUserSocket(data);
      setIsConnected(true);
    });

    // Disconnection event listener
    socket?.on("disconnect", () => {
      setIsConnected(false);
      console.log("Disconnected from server");
    });

    // Error event listener
    socket?.on("socketError", (errorMessage: string) => {
      console.error("Socket error:", errorMessage);
      setLastMessage(`Error: ${errorMessage}`);
    });

    // Join chat confirmation listener
    socket?.on("joinChat", (data: any) => {
      console.log("Joined chat:", data);
      setLastMessage("Successfully joined chat");
    });

    // Message listener
    socket?.on("message", (data: Message) => {
      console.log(data);

      setChatMessages((prevMessages) => [...prevMessages, data]);
    });

    // Typing event listener
    socket?.on("typing", () => {
      setIsTyping(true);
    });

    // Stop typing event listener
    socket?.on("stopTyping", () => {
      setIsTyping(false);
    });

    return () => {
      socket?.off("connected");
      socket?.off("disconnect");
      socket?.off("socketError");
      socket?.off("joinedChat");
      socket?.off("message");
      socket?.off("typing");
      socket?.off("stopTyping");
    };
  }, [socket]);

  // Function to join a chat room
  const joinChat = () => {
    if (chatId.trim()) {
      socket?.emit("joinChat", chatId);
      setChatMessages([]); // Clear messages for the new chat
    }
  };

  // Function to send a message
  const sendMessage = () => {
    if (message.trim()) {
      socket?.emit("message", { chatId, message, userSocket });
      // setChatMessages((prevMessages) => [...prevMessages, `You: ${message}`]);
      setMessage("");
      socket?.emit("stopTyping", chatId); // Emit stop typing after sending
    }
  };

  // Emit typing event when typing starts
  const handleTyping = () => {
    socket?.emit("typing", chatId);
  };

  // Emit stop typing event when typing stops
  const handleStopTyping = () => {
    socket?.emit("stopTyping", chatId);
  };

  const setMessageData = (e: any) => {
    handleTyping();
    setMessage(e.target.value);
  };

  return (
    <div className="App px-10">
      <header className="App-header">
        <h1>Socket.IO Chat</h1>
        <p className="font-medium text-red-700">
          User from socket: {userSocket}
        </p>
        <p>Connected: {isConnected ? "Yes" : "No"}</p>
        <p>Last message: {lastMessage || "-"}</p>
        <p>Typing: {isTyping ? "Someone is typing..." : "No one is typing"}</p>

        {/* Chat ID Input */}
        <input
          type="text"
          placeholder="Enter Chat ID"
          value={chatId}
          className="bg-neutral-600"
          onChange={(e) => setChatId(e.target.value)}
          style={{ marginBottom: "10px" }}
        />
        <Button onClick={joinChat}>Join Chat</Button>

        {/* Message Input */}
        <textarea
          rows={3}
          placeholder="Type your message here..."
          className="bg-neutral-600"
          value={message}
          onChange={(e) => setMessageData(e)}
          onFocus={handleTyping}
          onBlur={handleStopTyping}
          style={{ margin: "10px 0", width: "100%" }}
        />
        <Button onClick={sendMessage}>Send Message</Button>

        {/* Chat Messages */}
        <div
          style={{ marginTop: "20px", textAlign: "left", width: "100%" }}
          className="mb-20"
        >
          <h3>Chat Messages:</h3>
          {chatMessages.length > 0 &&
            chatMessages.map((msg, index) => (
              <p key={index}>
                <span className="text-purple-700">{msg.user} </span>:
                {msg.message}
              </p>
            ))}
        </div>
      </header>
    </div>
  );
}
