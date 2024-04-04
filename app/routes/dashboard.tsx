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
//   let formData = await request.formData();
//   let intent = formData.get("intent");

//   if (intent === "edit") {
//     return { ok: true };
//   }

//   if (intent === "logout") {
//     return await authenticator.logout(request, { redirectTo: "/login" });
//   }

//   throw json({ message: "Invalid intent" }, { status: 400 });
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
      {/* <Form method="post">
        <button type="submit" name="intent" value="edit">
          Edit
        </button>
      </Form> */}

      <Form method="post">
        <button type="submit">
          Logout
        </button>
      </Form>

      {/* logout */}
      {/* <Form method="post">
        <button type="submit" name="intent" value="logout">
          Logout
        </button>
      </Form> */}
    </>
  );
}
