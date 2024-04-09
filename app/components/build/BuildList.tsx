


import { Form, useSearchParams } from '@remix-run/react'

export default function BuildList() {
  const [searchParams] = useSearchParams();

  const view = searchParams.get("view") || "list";

  return (
    <div>
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

              {view === "list" ? 
              <p>View list</p> : 
              <p>detail list</p>}
    </div>
  )
}
