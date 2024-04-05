import type { MetaFunction } from "@remix-run/node";
import { Button } from "../components/ui/button";
import { ModeToggle } from "~/components/build/ModeToggle";
export const meta: MetaFunction = () => {
  return [
    { title: "Babble chat" },
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

export default function Index() {
  return (
    <div className="">
      <h1 className="text-4xl font-extrabold text-purple-600">
        Welcome to Remix
      </h1>
      <Button>Button, lets code on the beat</Button>
      <p>This is working now</p>
      <ModeToggle />
    </div>
  );
}
