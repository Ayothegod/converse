import { authenticator } from "~/services/auth.server";
import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Form, json, redirect } from "@remix-run/react";
import { useLoaderData, useActionData } from "@remix-run/react";
import { getUserSessionData } from "~/lib/session";
import prisma from "~/lib/db";

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
  const {headers, sessionData} = await getUserSessionData(request)
  console.log(sessionData);
  
  let user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  })
  const userDetails = await prisma.user.findUnique({
    where: {
      id: sessionData.userId,
    },
  });

  if (!userDetails?.defaultImageUrl && !userDetails?.username) {
    return redirect("/onboarding", { headers });
  }
  return {user, sessionData}
}

export async function action({ request }: ActionFunctionArgs) {
  await authenticator.logout(request, { redirectTo: "/login" });
};

export default function Dashboard() {
  const data = useLoaderData<typeof loader>();
  // TODO: if user logins, there will be no username on the session object

  return (
    <>
      <div className="text-5xl font-bold text-black dark:text-white">
        dashboard route
      </div>

      {
        JSON.stringify(data.sessionData, null, 8)
      }

      {/* logout */}
      <Form method="post">
        <button type="submit" name="_action" value="logout">
          Logout
        </button>
      </Form>
    </>
  );
}
