import { authenticator } from "~/services/auth.server";
import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Form, json, redirect } from "@remix-run/react";
import { useLoaderData, useActionData } from "@remix-run/react";
import { UserSessionType } from "../lib/types";
import { ModeToggle } from "~/components/build/ModeToggle";
export const meta: MetaFunction = () => {
  return [
    { title: "Babble chat - Onboarding" },
    {
      property: "og:title",
      content: "Very cool app",
    },
    {
      name: "description",
      content: "Elevate your conversations, embrace the future of messaging.",
    },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  let user = await authenticator.isAuthenticated(request);
  // TODO: test for when a new user is created
  if (user && (user as UserSessionType).session === "new_user") {
    return null;
  } else {
    return redirect("/dashboard");
  }
}

export default function Onboarding() {
  return (
  <div>
    Hello users
      <ModeToggle />

  </div>
  )
}
