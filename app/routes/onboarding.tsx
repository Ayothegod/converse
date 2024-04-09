import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { Form, json, redirect, useLoaderData } from "@remix-run/react";
import { User } from "lucide-react";
import { ModeToggle } from "~/components/build/ModeToggle";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { getUserSessionData } from "~/lib/session";
import { authenticator } from "~/services/auth.server";

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
  const {sessionData, headers} = await getUserSessionData(request);
  console.log(sessionData);
  

  if (user && user?.typeOfUser === "new_user") {

    if(user?.userUsername !== null){
      return redirect("/dashboard", { headers })
    }
    return json(user, { headers });
  } else {
    return redirect("/dashboard", { headers });
  }
}

export async function action({ request, context, params }: ActionFunctionArgs) {
  const {sessionData, headers} = await getUserSessionData(request);

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
    return null;
  }
  throw new Error("Unknown action");
}

export default function Onboarding() {
  const data = useLoaderData<typeof loader>();
  // console.log(data);

  return (
    <Form method="post">
      <main className=" flex items-center justify-center h-screen p-4">
        <section className="mx-auto w-full sm:w-[80vw] md:w-[60vw] lg:w-[50%] flex flex-col bg-light-bg dark:bg-dark-bg rounded-md overflow-hidden p-2">
          <h1 className="text-primary text-lg sm:text-2xl font-black">
            Let's get you onboard
          </h1>
          <Label className="text-xs">
            Follow the setup below to get started
          </Label>

          <div className="mt-6 space-y-2">
            <div className="bg-dark-primary p-2 rounded-md flex items-end justify-between gap-2">
              <div className="flex flex-col item-start gap-1 w-full">
                <Label className="text-xs font-medium">choose username</Label>
                <Input
                  type="text"
                  name="username"
                  required
                  placeholder="Enter username"
                  className=" text-dark-bg  dark:text-light-bg w-full"
                />
              </div>

              <Button variant="primary" name="intent" value="updateUsername" className="dark:bg-dark-bg dark:text-white">
                Start
              </Button>
            </div>

            <div className="bg-dark-primary p-2  rounded-md flex flex-col sm:flex-row gap-y-4 sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <User />
                <p>Update user details</p>
              </div>

              <div className="flex gap-2 w-full sm:w-auto">
                <Button variant="primary" className="w-full sm:w-auto" name="intent" value="start">
                  Start
                </Button>
                <Button className="w-full sm:w-auto" name="intent" value="skip">
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
