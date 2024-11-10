import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./layouts/MainLayout.tsx";
import Root, { RootError, Loader as rootLoader } from "./routes/root.tsx";
import LearnSwr, {
  // ErrorBoundary,
  Loader as swrLoader,
} from "./routes/learn.tsx";
import Chat from "./routes/chat.tsx";
import Register from "./routes/register.tsx";
import Login from "./routes/login.tsx";
import Home from "./routes/home.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <RootError />,
    loader: rootLoader,
  },
  {
    path: "/learnswr",
    element: <LearnSwr />,
    errorElement: <RootError />,
    loader: swrLoader,
  },
  {
    path: "/chat",
    element: <Chat />,
    errorElement: <RootError />,
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
    // errorElement: <MainLayoutError />,
    children: [
      {
        path: "/home",
        element: <Home />,
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
