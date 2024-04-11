import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError,
  json,
} from "@remix-run/react";
import clsx from "clsx";
import {
  PreventFlashOnWrongTheme,
  ThemeProvider,
  useTheme,
} from "remix-themes";
import stylesheet from "~/tailwind.css?url";
import { themeSessionResolver } from "./services/themeSession.server";
import { getToast } from "remix-toast";
import { useEffect } from "react";
import { Toaster, toast as notify } from "sonner";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const { getTheme } = await themeSessionResolver(request);
  const { toast, headers } = await getToast(request);
  const theme = await getTheme();
  return json({ theme, toast }, { headers });
}

export default function AppWithProviders() {
  const { theme, toast } = useLoaderData<typeof loader>();
  useEffect(() => {
    if (toast?.type === "error") {
      notify.error(toast.message, {
        duration: 3000,
        description: toast.description,
        position: "top-right",
      });
    }
    if (toast?.type === "success") {
      notify.success(toast.message, {
        duration: 3000,
        description: toast.description,
        position: "top-right",
      });
    }
  }, [toast]);

  return (
    <ThemeProvider specifiedTheme={theme} themeAction="/action/set-theme">
      <App />
    </ThemeProvider>
  );
}

export function App() {
  const data = useLoaderData<typeof loader>();
  const [theme] = useTheme();
  return (
    <html lang="en" className={clsx(theme)}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <PreventFlashOnWrongTheme ssrTheme={Boolean(data.theme)} />
        <Links />
      </head>
      <body className="font-inter">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <Toaster />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);
  return (
    <html>
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <p>Error Page</p>
        <Scripts />
      </body>
    </html>
  );
}
