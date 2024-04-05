import { authenticator } from "~/services/auth.server";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, json, redirect } from "@remix-run/react";
import { useLoaderData, useActionData } from "@remix-run/react";
import { UserSessionType } from "../lib/types";

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
  return <div>Hello Users Onboarding</div>;
}
