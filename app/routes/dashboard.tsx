import { authenticator } from "~/services/auth.server";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export async function loader({ request }: LoaderFunctionArgs) {
  // If the user is already authenticated redirect to /dashboard directly
  let user;
  return (user = await authenticator.isAuthenticated(request));
}

export default function dashboard() {
  const data = useLoaderData<typeof loader>();
  console.log({data: data});

  return <div>dashboard route</div>;
}
