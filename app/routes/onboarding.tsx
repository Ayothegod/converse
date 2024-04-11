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
import { redirectWithSuccess, jsonWithSuccess } from "remix-toast";
import BuildList from "~/components/build/BuildList";
import { ModeToggle } from "~/components/build/ModeToggle";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import {
  addGeneratedRandomImage,
  addUserDetails,
  errorResponse,
  updateUsername,
} from "~/lib/actions";
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
  // console.log("visited onboarding");

  if (user && user?.typeOfUser === "new_user") {
    // TODO: can fetch userData and check to always redirect on load since it can only work for new users

    // if (sessionData && sessionData.username) {
    //   return redirect("/dashboard", { headers });
    // }
    return json(user, { headers });
  } else {
    return redirect("/dashboard", { headers });
  }
}

export async function action({ request }: ActionFunctionArgs) {
  const { sessionData, headers } = await getUserSessionData(request);
  const formData = await request.formData();

  const intent = await formData.get("intent");
  const view = await formData.get("view");
  const username = formData.get("username");
  const fullname = formData.get("fullname");
  const punchline = formData.get("punchline");
  const bio = formData.get("bio");

  // NOTE: update/add username
  if (intent === "updateUsername" && username !== null) {
    const result = await updateUsername(request, sessionData, username);

    if (result.errors) {
      return json({ errors: result.errors, result: null });
    }

    const headers = await result.headers;

    return jsonWithSuccess(
      { errors: null, result: "username updated" },
      {
        message: "Username created successfully!🎉",
      },
      { headers }
    );
  }

  if (sessionData.username) {
    if (intent === "addUserDetails") {
      const result = await addUserDetails(
        sessionData,
        fullname,
        punchline,
        bio
      );

      if (result.errors) {
        return json({ errors: result.errors, result: null });
      }

      return redirectWithSuccess("/dashboard", {
        message: "User details registration completed!",
        description: "Time to chat away, yay 🔥",
      });
    }
  } else {
    console.log("cant add details");
    return { errors: null, result: false };
  }

  // NOTE: skip user details
  if (intent === "skip") {
    const { errors, result } = await addGeneratedRandomImage(request);
    if (errors) {
      return json({ errors, result: null });
    }

    return redirectWithSuccess(
      "/dashboard",
      {
        message: "User details registration skipped!",
        description: "to continue, go to the profile section",
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
  const disableUsername = actionData?.result ? true : false;
  const chooseUsernameFirst = actionData?.result === false;

  const [searchParams] = useSearchParams();
  const view = searchParams.get("view") || "skip";

  return (
    <main className=" flex items-center justify-center h-screen p-4">
      <section className="mx-auto w-full sm:w-[80vw] md:w-[60vw] lg:w-[50%] flex flex-col bg-light-bg dark:bg-dark-bg rounded-md overflow-hidden p-2">
        <h1 className="text-primary text-lg sm:text-2xl font-black">
          Let's get you onboard
        </h1>
        <Label className="text-xs">Follow the setup below to get started</Label>

        {chooseUsernameFirst && (
          <em className="text-xs text-red-600">
            you must have a username to complete signup
          </em>
        )}
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
                size="sm"
                variant="primary"
                name="intent"
                value="updateUsername"
                className="font-bold"
                disabled={disableUsername}
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
              <Label>Add user details</Label>
            </div>

            {view === "start" ? null : (
              <div className="flex gap-2 w-full sm:w-auto">
                <Form className="w-full">
                  <Button
                    variant="primary"
                    className="w-full sm:w-auto"
                    size="sm"
                    name="view"
                    value="start"
                  >
                    start
                  </Button>
                </Form>
                <Form method="post" className="w-full">
                  <Button
                    className="w-full sm:w-auto"
                    size="sm"
                    name="intent"
                    value="skip"
                    // name="view"
                    // value="skip"
                  >
                    skip
                  </Button>
                </Form>
              </div>
            )}
          </div>
          {actionData?.errors?.image ? (
            <em className="text-xs text-red-600">
              {actionData?.errors?.image}
            </em>
          ) : null}

          {/* DEBUG:start updating user details */}
          {view === "skip" ? null : (
            <Form method="post">
              <div className="contain">
                <div className="space-y-2">
                  {/* DEBUG: error rendering */}
                  {actionData?.errors?.fullname ||
                  actionData?.errors?.punchline ||
                  actionData?.errors?.bio ||
                  actionData?.errors?.addUserInfo ? (
                    <div className="flex flex-col gap-1">
                      <em className="text-xs text-red-600">
                        {actionData?.errors.fullname}
                      </em>
                      <em className="text-xs text-red-600">
                        {actionData?.errors.punchline}
                      </em>
                      <em className="text-xs text-red-600">
                        {actionData?.errors.bio}
                      </em>
                      <em className="text-xs text-red-600">
                        {actionData?.errors.addUserInfo}
                      </em>
                    </div>
                  ) : null}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="flex flex-col item-start gap-1 w-full">
                      <Label className="text-xs font-medium">Full name</Label>
                      <Input
                        type="text"
                        name="fullname"
                        placeholder="Enter fullname"
                        className=" text-dark-bg  dark:text-light-bg w-full"
                      />
                    </div>
                    <div className="flex flex-col item-start gap-1 w-full">
                      <Label className="text-xs font-medium">
                        Punchline 😉
                      </Label>
                      <Input
                        type="text"
                        name="punchline"
                        placeholder="your best punchline yet"
                        className=" text-dark-bg  dark:text-light-bg w-full"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col item-start gap-1 w-full">
                    <Label className="text-xs font-medium">Bio</Label>
                    <Textarea
                      name="bio"
                      placeholder="Tell us a little bit about yourself"
                      className=" text-dark-bg  dark:text-light-bg w-full resize-none"
                    />
                  </div>
                  <Button
                    size="sm"
                    variant="primary"
                    name="intent"
                    value="addUserDetails"
                    className="font-bold mt-4 w-full"
                    disabled={busy}
                  >
                    {busy ? "loading" : "complete signup"}
                    {busy ? <Loader2 className={`animate-spin`} /> : null}
                  </Button>
                </div>

                <p className="text-xs font-medium mt-4 text-primary">
                  Note: profile section to upload profile image
                </p>
              </div>
            </Form>
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
