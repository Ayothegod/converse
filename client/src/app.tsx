import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./layouts/MainLayout.tsx";
import Chats from "./routes/chats.tsx";
import Groups from "./routes/groups.tsx";
import Login from "./routes/login.tsx";
import Register from "./routes/register.tsx";
import Root, { RootError, Loader as rootLoader } from "./routes/root.tsx";
import Chat from "./routes/chat.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <RootError />,
    loader: rootLoader,
  },
  {
    path: "/register",
    element: <Register />,
    errorElement: <RootError />,
  },
  {
    path: "/login",
    element: <Login />,
    errorElement: <RootError />,
  },
  {
    element: <MainLayout />,
    errorElement: <RootError />,
    children: [
      {
        path: "/chat",
        element: <Chats />,
        children: [
          {
            path: "c/:id",
            element: <Chat />,
            loader: async ({ params }) => {
              return params.id;
            },
          },
        ],
      },
      {
        path: "/chat/group",
        element: <Groups />,
      },
    ],
  },
]);

export default function App() {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}
