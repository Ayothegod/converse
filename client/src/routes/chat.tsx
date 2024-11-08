/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("localhost:8080");

export default function Chat() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [lastMessage, setLastMessage] = useState(null);

  useEffect(() => {
    socket.on("connect", () => {
      setIsConnected(true);
    });
    socket.on("disconnect", () => {
      setIsConnected(false);
    });
    socket.on("message", (data: any) => {
      console.log(data);
      setLastMessage(data);
    });
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("message");
    };
  });

  const sendMessage = () => {
    console.log("Start hello");
    socket.emit("hello!");
  };

  return (
    <div className="App">
      <header className="App-header">
        <p>Connected: {"" + isConnected}</p>
        <p>Last message: {lastMessage || "-"}</p>
        <button onClick={sendMessage}>Say hello!</button>
      </header>
    </div>
  );
}
