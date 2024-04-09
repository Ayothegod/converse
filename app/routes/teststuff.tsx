import { LoaderFunctionArgs } from "@remix-run/node";
import { Form, useSearchParams } from "@remix-run/react";

// export async function loader({ request }: LoaderFunctionArgs) {
//     return null
//   }

export default function List() {
//   const [searchParams] = useSearchPar ams();
  const [searchParams] = useSearchParams();
  const view = searchParams.get("view") || "list";

  return (
    <div className="m-24">
      <Form className="space-x-8">
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
      "<DetailView />"}
    </div>
  );
}
