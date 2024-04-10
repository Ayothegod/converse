import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, useActionData, useSearchParams } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { useEffect } from "react";
// export async function loader({ request }: LoaderFunctionArgs) {
//   return null;
// }
import { jsonWithSuccess, jsonWithError } from "remix-toast";

export async function action({ request }: ActionFunctionArgs) {
  const test = true;
  if (test) {
    console.log("fetch data");
    // return jsonWithSuccess(
    //   { result: "Data saved successfully" },
    //   "Operation successful! 🎉"
    // );
    return jsonWithSuccess(
      { result: "Data saved successfully" },
      {
        message: "Operation successful! 🎉",
        description: "dksdklklsdklsdklklsdmds dskdskllsdklds",
      }
    );
  }


  console.log("false: unable to fetch data");
  return jsonWithError(
    null,
    "Oops! Something went wrong. Please try again later."
  );
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
