import { authenticator } from "~/services/auth.server";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, json } from "@remix-run/react";
import { useLoaderData, useActionData } from "@remix-run/react";

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

export default function dashboard() {
  const data = useLoaderData<typeof loader>();
  console.log(data);

  return (
    <>
      <div className="text-5xl text-black font-bol underline">
        dashboard route
      </div>

      <div>
        {JSON.stringify(data, null, 2)}
      </div>

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
