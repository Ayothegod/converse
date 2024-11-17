export const sidebarData = [
  { id: 1, title: "Dashboard", url: "/dashboard", iconType: "LayoutDashboard" },
  { id: 4, title: "Analytics", url: "/Analytics", iconType: "BarChartBig" },
  { id: 6, title: "Accounts", url: "/Accounts", iconType: "Users" },
];

export const ChatEvent = Object.freeze({
  CONNECTED_EVENT: "connected",
  DISCONNECT_EVENT: "disconnect",
  JOIN_CHAT_EVENT: "joinChat",
  NEW_CHAT_EVENT: "newChat",
  TYPING_EVENT: "typing",
  STOP_TYPING_EVENT: "stopTyping",
  MESSAGE_RECEIVED_EVENT: "messageReceived",
  LEAVE_CHAT_EVENT: "leaveChat",
  UPDATE_GROUP_NAME_EVENT: "updateGroupName",
  MESSAGE_DELETE_EVENT: "messageDeleted",
  SOCKET_ERROR_EVENT: "socketError",
});