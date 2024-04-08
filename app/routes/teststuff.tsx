import { LoaderFunctionArgs } from "@remix-run/node";
import { Form, useSearchParams } from "@remix-run/react";

export async function loader({ request }: LoaderFunctionArgs) {
    return null
  }
export default function List() {
  const [searchParams] = useSearchParams();
  const view = searchParams.get("view") || "list";

  return (
    <div className="m-24">
      <Form >
        <button name="view" value="list" className="bg-red-600">
          View as List
        </button>
        <button name="view" value="details">
          View with Details
        </button>
      </Form>

      <p className="text-4xl text-emerald-600 m-20">Hello</p>
      {view === "list" ? "<ListView />" : "<DetailView />"}
    </div>
  );
}
