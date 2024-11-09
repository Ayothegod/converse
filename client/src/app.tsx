import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./layouts/MainLayout.tsx";
import Root, { RootError, Loader as rootLoader } from "./routes/root.tsx";
import LearnSwr, {
  // ErrorBoundary,
  Loader as swrLoader,
} from "./routes/learn.tsx";
import Chat from "./routes/chat.tsx";
import Register from "./routes/register.tsx";

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
  //   {
  // 	path: "/login",
  // 	element: <Login />,
  // 	loader: loginLoader,
  // 	errorElement: <ErrorBoundary />,
  //   },
  {
    element: <MainLayout />,
    // errorElement: <MainLayoutError />,
    // children: [
    //   {
    // 	path: "/dashboard",
    // 	element: <Dashboard />,
    // 	loader: dashboardLoader,
    //   },
    // ],
  },
]);

export default function App() {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}
