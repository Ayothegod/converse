import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import {
  Form,
  json,
  redirect,
  useActionData,
  useLoaderData,
  useNavigation,
  useRouteError,
  useSearchParams,
} from "@remix-run/react";
import { Loader2, User } from "lucide-react";
import { redirectWithSuccess } from "remix-toast";
import BuildList from "~/components/build/BuildList";
import { ModeToggle } from "~/components/build/ModeToggle";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { errorResponse, updateUsername } from "~/lib/actions";
import prisma from "~/lib/db";
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
  const { sessionData, headers } = await getUserSessionData(request);
  console.log("visited onboarding");

  if (user && user?.typeOfUser === "new_user") {
    if (sessionData && sessionData.username) {
      return redirect("/dashboard", { headers });
    }
    return json(user, { headers });
  } else {
    return redirect("/dashboard", { headers });
  }
}

export async function action({ request }: ActionFunctionArgs) {
  const { sessionData, headers } = await getUserSessionData(request);
  const formData = await request.formData();

  const intent = await formData.get("intent");
  const username = formData.get("username");

  // if (intent === "start") {
  //   console.log("start");
  //   return null;
  // if (intent === "skip") {
  //   console.log("skip");
  //   return null;
  // }
  // }

  if (intent === "updateUsername" && username !== null) {
    const result = await updateUsername(request, sessionData, username);

    if (result.errors) {
      return json({ errors: result.errors });
    }

    const headers = await result.headers;
    console.log(result.sessionData);
    return redirectWithSuccess(
      "/dashboard",
      {
        message: "User registration completed!",
        description: "time to babble 😎",
      },
      { headers }
    );
  }

  errorResponse("Unknown Action", 500);
}

export default function Onboarding() {
  const { state } = useNavigation();
  const busy = state === "submitting";

  const data = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  const [searchParams] = useSearchParams();
  const view = searchParams.get("view") || "skip";

  return (
    <main className=" flex items-center justify-center h-screen p-4">
      <section className="mx-auto w-full sm:w-[80vw] md:w-[60vw] lg:w-[50%] flex flex-col bg-light-bg dark:bg-dark-bg rounded-md overflow-hidden p-2">
        <h1 className="text-primary text-lg sm:text-2xl font-black">
          Let's get you onboard
        </h1>
        <Label className="text-xs">Follow the setup below to get started</Label>

        <div className="mt-6 space-y-2">
          {/* username */}
          <Form method="post">
            <div className="contain p-2 flex items-end justify-between gap-2">
              <div className="flex flex-col item-start gap-1 w-full">
                <Label className="text-xs font-medium">choose username</Label>
                {actionData?.errors?.username ? (
                  <em className="text-xs text-red-600">
                    {actionData?.errors.username}
                  </em>
                ) : null}
                <Input
                  type="text"
                  name="username"
                  required
                  placeholder="Enter username"
                  className=" text-dark-bg  dark:text-light-bg w-full"
                />
              </div>

              <Button
                variant="primary"
                name="intent"
                value="updateUsername"
                className="font-bold"
              >
                {busy ? "loading" : "continue"}
                {busy ? <Loader2 className={`animate-spin`} /> : null}
              </Button>
            </div>
          </Form>

          {/* details */}
          <div className="contain rounded-md flex flex-col sm:flex-row gap-y-2 sm:items-center sm:justify-between">
            <div className="flex items-center gap-1">
              <User />
              <Label>Update user details</Label>
            </div>

            <Form>
              {view === "skip" && (
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button
                    variant="primary"
                    className="w-full sm:w-auto"
                    // name="intent"
                    // value="start"
                    name="view"
                    value="start"
                  >
                    start
                  </Button>
                  <Button
                    className="w-full sm:w-auto"
                    // name="intent"
                    // value="skip"
                    name="view"
                    value="skip"
                  >
                    skip
                  </Button>
                </div>
              )}
            </Form>
          </div>

          {view === "skip" ? null : (
            <div className="contain">
              <p>update user details</p>
            </div>
          )}
        </div>

        <ModeToggle />
      </section>
    </main>
  );
}

export function ErrorBoundary() {
  const error: unknown | any = useRouteError();
  // console.error(error);
  return (
    <main className=" flex items-center justify-center h-screen p-4">
      <section className="mx-auto w-full sm:w-[80vw] md:w-[60vw] lg:w-[50%] flex flex-col bg-light-bg dark:bg-dark-bg rounded-md overflow-hidden p-2">
        <h1>Ooops! there was an error</h1>

        <p>cause: {error.data}</p>
      </section>
    </main>
  );
}
