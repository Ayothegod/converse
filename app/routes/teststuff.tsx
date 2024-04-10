import { ActionFunctionArgs } from "@remix-run/node";
import { Form } from "@remix-run/react";
import {
  jsonWithSuccess,
  redirectWithError,
  redirectWithSuccess
} from "remix-toast";
import { Button } from "~/components/ui/button";

export async function action({ request }: ActionFunctionArgs) {
  const test = true;
  if (test) {
    const toast = jsonWithSuccess(
      { result: "Data saved successfully" },
      {
        message: "Operation successful! 🎉",
        description: "description of toast",
      }
    );
    return redirectWithSuccess("/login", {
      message: "You are logged in!",
      description: "description of toast",
    }, {});
  }
  return redirectWithError("/login", "You need to login to access this page");
}

export default function List() {
  return (
    <div className="m-48">
      {/* search params state */}
      <div>
        {/* <Form className="space-x-8">
        <button
          name="view"
          value="list"
          className=" bg-dark-primary hover:bg-dark-foreground hover:shadow-xl p-2 rounded text-sm font-bold text-light-primary"
        >
          View as List
        </button>
        <button
          name="view"
          value="details"
          className=" bg-dark-bg p-2 hover:bg-dark-foreground hover:shadow-xl rounded text-sm font-bold text-light-primary"
        >
          View with Details
        </button>
      </Form>

      <p className="text-4xl font-bold text-emerald-600 m-10">Test Stuff</p>
      {view === "list" 
      ? 
      <div className="max-h-10 overflow-hidden border border-red-400">

      <input type="text" placeholder="enter list details" className="-translate-y-10"/> 
      </div>
      : 
      "<DetailView />"} */}
      </div>

      {/* handle toast */}
      <div>
        <Form method="post">
          <Button>Fetch Data</Button>
        </Form>
      </div>
    </div>
  );
}
