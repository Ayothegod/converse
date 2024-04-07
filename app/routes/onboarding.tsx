import { authenticator } from "~/services/auth.server";
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { Form, json, redirect, useSearchParams } from "@remix-run/react";
import { useLoaderData, useActionData } from "@remix-run/react";
import { UserSessionType } from "../lib/types";
import { ModeToggle } from "~/components/build/ModeToggle";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { Contact, PersonStanding, User } from "lucide-react";
import { Input } from "~/components/ui/input";
import { getSession } from "~/services/session.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Babble chat - Onboarding" },
    {
      property: "og:title",
      content: "Very cool app",
    },
    {
      name: "description",
      content: "Elevate your conversations, embrace the future of messaging.",
    },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  let user = await authenticator.isAuthenticated(request);
  const session = await getSession()
  console.log(session.data);

  if (session.has("userId")) {
    // Redirect to the home page if they are already signed in.
    // return redirect("/");
    console.log("userId");
    
  }
  

  // TODO: test for when a new user is created
  if (user && (user as UserSessionType).session === "new_user") {
    return user
  } else {
    return redirect("/dashboard");
  }
}

export async function action({ request, context, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = await formData.get("intent");
  if (intent === "start") {
    console.log("start");
    return null;
  }
  if (intent === "skip") {
    console.log("skip");
    return null;
  }
  if (intent === "updateUsername") {
    console.log("updateUsername");
    console.log(request, context, params);
    
    return null;
  }
  throw new Error("Unknown action");
}

export default function Onboarding() {
  const data = useLoaderData<typeof loader>()
  console.log(data);
  
  return (
    <Form method="post">
      <main className=" flex items-center justify-center h-screen p-4">
        <section className="mx-auto w-full md:w-[80vw] lg:w-[70%] flex flex-col bg-light-bg dark:bg-dark-bg rounded-md overflow-hidden p-2">
          <h1 className="text-primary text-2xl font-extrabold font-mono">
            Let's get you onboard
          </h1>
          <Label className="text-xs">
            Follow the setup below to get you started
          </Label>

          <div className="mt-6 mx-4 space-y-2">
            <div className=" p-2 border border-primary rounded-md flex items-end justify-between gap-2">
              <div className="flex flex-col item-start gap-1 w-full">
                <Label className="text-xs ">choose username</Label>
                <Input
                  type="text"
                  name="username"
                  placeholder="Enter username"
                  className=" text-dark-bg  dark:text-light-bg w-full"
                />
              </div>
              {/* <Input type="hidden" name="title" value={data.userId as any} /> */}

              <Button variant="primary" name="intent" value="updateUsername">
                Start
              </Button>
            </div>

            <div className=" p-2 border border-primary rounded-md flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User />
                <p>Update user details</p>
              </div>

              <div className="flex gap-2">
                <Button variant="primary" name="intent" value="start">
                  Start
                </Button>
                <Button name="intent" value="skip">
                  Skip
                </Button>
              </div>
            </div>
          </div>

          <ModeToggle />
        </section>
      </main>
    </Form>
  );
}
