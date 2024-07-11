import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import MainLayout from "./layouts/MainLayout.tsx";
import RootLayout from "./layouts/RootLayout.tsx";
import Root, { RootError, Loader as rootLoader } from "./routes/root.tsx";
import LearnSwr, {
  ErrorBoundary,
  Loader as swrLoader,
} from "./routes/learn.tsx";
import { ThemeProvider } from "./lib/hook/theme.tsx";

// NOTE: make sure to add errorBoundary to all routes that throw error from loader and actions
// Add shadcn toast

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
    errorElement: <ErrorBoundary />,
    loader: swrLoader,
  },
  // {
  // 	path: "/register",
  // 	element: <Register />,
  // 	errorElement: <ErrorBoundary />,
  //   },
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
    //   {
    // 	path: "/transactions",
    // 	element: <Transactions />,
    // 	loader: transactionLoader,
    //   },
    //   {
    // 	path: "/account",
    // 	element: <Account />,
    // 	loader: accountLoader,
    //   },
    //   {
    // 	path: "/wallet",
    // 	element: <Wallet />,
    //   },
    // ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <RootLayout>
        <RouterProvider router={router} />
        {/* <Toaster /> */}
      </RootLayout>
    </ThemeProvider>
  </React.StrictMode>
);
