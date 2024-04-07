import { Label } from "@radix-ui/react-dropdown-menu";
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { Form, redirect, useNavigation } from "@remix-run/react";
import { Loader2 } from "lucide-react";
import { AuthCarousel } from "~/components/build/AuthCarousel";
import { ModeToggle } from "~/components/build/ModeToggle";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { setUserSessionData } from "~/lib/session";
import { authenticator } from "~/services/auth.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Babble chat - login" },
    {
      name: "description",
      content: "Elevate your conversations, embrace the future of messaging.",
    },
  ];
};

// login or signup
export async function action({ request }: ActionFunctionArgs) {
  let user = await authenticator.authenticate("user-pass", request, {
    failureRedirect: "/login",
  });
  const headers = await setUserSessionData(request, user);

  if (user?.typeOfUser === "returning_user")
    return redirect("/dashboard", { headers });
  return redirect("/onboarding", { headers });
}

// check if user session already exists
export async function loader({ request }: LoaderFunctionArgs) {
  return await authenticator.isAuthenticated(request, {
    successRedirect: "/dashboard",
  });
}

export default function Screen() {
  const { state } = useNavigation();
  return (
    <main className=" flex items-center justify-center h-screen p-4">
      <ModeToggle />
      <section className="mx-auto w-full md:h-[80vh] md:w-[80vw] lg:w-[70%] flex bg-light-bg dark:bg-dark-bg rounded-md overflow-hidden">
        <div className="flex-[50%] p-10 space-y-4">
          <h1 className="text-primary text-2xl font-extrabold font-mono">
            BabbleChat
          </h1>

          <div>
            <h2 className="text-dark-foreground dark:text-light-foreground text-lg md:text-x font-bold">
              Log in to your Account
            </h2>
            <p className="text-sm">Welcome back!</p>
          </div>

          <div>
            <Button className="w-full">Google</Button>
          </div>
          <p className="text-xs text-center">or continue with email</p>

          <Form method="post" className="space-y-4">
            <Input
              type="email"
              name="email"
              required
              placeholder="Email Address"
              className=" text-dark-bg  dark:text-light-bg"
            />
            <Input
              type="password"
              name="password"
              required
              placeholder="password"
              autoComplete="current-password"
              className=" text-dark-bg dark:text-light-bg"
            />
            <Label className="text-xs text-right text-primary">
              Forgot Password?
            </Label>
            <Button className="w-full bg-primary gap-2">
              {state === "idle" ? null : <Loader2 className={`animate-spin`} />}
              {state === "idle"
                ? "Log in"
                : state === "loading"
                ? "Loading"
                : state === "submitting" && "Submitting"}
            </Button>
          </Form>

          <p className="text-xs font-medium text-center">
            Don't have an account?{" "}
            <span className="text-primary">Create an account</span>
          </p>
        </div>

        <div className="hidden flex-[50%] bg-primary md:flex items-center justify-center">
          <AuthCarousel />
        </div>
      </section>
    </main>
  );
}
