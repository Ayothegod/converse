import { authenticator } from "~/services/auth.server";
import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Form, json } from "@remix-run/react";
import { useLoaderData, useActionData } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Babble chat - dashboard" },
    {
      name: "description",
      content: "Elevate your conversations, embrace the future of messaging.",
    },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  let user;
  return (user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  }));
}

// async function action({ request }: ActionFunctionArgs) {
//   const formData = await request.formData();
//   const _action = formData.get("_action");

//   if (_action === "edit") {
//     return { ok: true };
//   }

//   if (_action === "logout") {
//     return await authenticator.logout(request, { redirectTo: "/login" });
//   }

//   throw new Error("Unknown action")
// }

export async function action({ request }: ActionFunctionArgs) {
  await authenticator.logout(request, { redirectTo: "/login" });
};

export default function Dashboard() {
  const data = useLoaderData<typeof loader>();
  // console.log(data);

  return (
    <>
      <div className="text-5xl font-bol underline">
        dashboard route available dffjddfnmsnm omg heelldklsd
      </div>

      {/* <div>
        {JSON.stringify(data, null, 2)}
      </div> */}

      {/* update stuff */}
      <Form method="post">
        <button type="submit" name="_action" value="edit">
          Edit
        </button>
      </Form>

      {/* <Form method="post">
        <button type="submit">
          Logout
        </button>
      </Form> */}

      {/* logout */}
      <Form method="post">
        <button type="submit" name="_action" value="logout">
          Logout
        </button>
      </Form>
    </>
  );
}

















// import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
// import {
//   Links,
//   Meta,
//   Outlet,
//   Scripts,
//   ScrollRestoration,
//   useLoaderData
// } from "@remix-run/react";
// import clsx from "clsx";
// import {
//   PreventFlashOnWrongTheme,
//   ThemeProvider,
//   useTheme,
// } from "remix-themes";
// import stylesheet from "~/tailwind.css?url";
// import { themeSessionResolver } from "./services/themeSession.server";

// export const links: LinksFunction = () => [
//   { rel: "stylesheet", href: stylesheet },
// ];

// // export async function loader({ request }: LoaderFunctionArgs) {
// //   const { getTheme } = await themeSessionResolver(request);
// //   return {
// //     theme: getTheme(),
// //   };
// // }

// export function Layout({ children }: { children: React.ReactNode }) {
//   // const data = useLoaderData<typeof loader>();
//   // const [theme] = useTheme()
//   return (
//     // <html lang="en" className={clsx(theme)}>
//     <html lang="en">
//       <head>
//         <meta charSet="utf-8" />
//         <meta name="viewport" content="width=device-width, initial-scale=1" />
//         <Meta />
//         {/* <PreventFlashOnWrongTheme ssrTheme={Boolean(data.theme)} /> */}
//         <Links />
//       </head>
//       <body>
//         {/* <ThemeProvider
//           specifiedTheme={data.theme}
//           themeAction="/action/set-theme"
//         > */}
//           {children}
//         {/* </ThemeProvider> */}
//         <ScrollRestoration />
//         <Scripts />
//       </body>
//     </html>
//   );
// }

// export default function App() {
//   return (
//     <Outlet />
//   )
// }