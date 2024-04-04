import { authenticator } from "~/services/auth.server";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form } from "@remix-run/react";

// login or signup
export async function action({  request }: ActionFunctionArgs) {
  return await authenticator.authenticate("user-pass", request, {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
  });
}

// check if user session already exists
export async function loader({ request }: LoaderFunctionArgs) {
  return await authenticator.isAuthenticated(request, {
    successRedirect: "/dashboard",
  });
}

export default function Screen() {

  return (
    <Form method="post" className="flex flex-col items-center gap-6 mt-8">
      <input
        type="email"
        name="email"
        required
        className="border border-blacK"
      />
      <input
        className="border border-blacK"
        type="password"
        name="password"
        autoComplete="current-password"
        required
      />
      <button>Sign In</button>
    </Form>
  );
}
