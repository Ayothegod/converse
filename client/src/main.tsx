// import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import RootLayout from "./layouts/RootLayout.tsx";
import App from "./app.tsx";
import { ThemeProvider } from "./lib/hook/useTheme.tsx";
import { Toaster } from "@/components/ui/toaster";
import { SocketProvider } from "./lib/context/useSocketContext.tsx";


ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SocketProvider>
        <RootLayout>
          <App />
          <Toaster />
        </RootLayout>
      </SocketProvider>
    </ThemeProvider>
  // </React.StrictMode>
);
