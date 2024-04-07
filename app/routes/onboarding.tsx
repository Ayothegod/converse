import { authenticator } from "~/services/auth.server";
import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Form, json, redirect } from "@remix-run/react";
import { useLoaderData, useActionData } from "@remix-run/react";
import { UserSessionType } from "../lib/types";
import { ModeToggle } from "~/components/build/ModeToggle";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
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
    <main className=" flex items-center justify-center h-screen p-4">
    <section className="mx-auto w-full md:w-[80vw] lg:w-[70%] flex flex-col bg-light-bg dark:bg-dark-bg rounded-md overflow-hidden p-2">
      <h1 className="text-primary text-2xl font-extrabold font-mono">Let's get you onboard</h1>
      <Label className="text-xs">Follow the setup below to get you started</Label>

      <div>
        <Button variant="primary">Hello</Button>
      </div>
      <ModeToggle />

  </section>
  </main>
  )
}
