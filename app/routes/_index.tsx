import type { MetaFunction } from "@remix-run/node";
import { Button } from "../components/ui/button";
import { ModeToggle } from "~/components/build/ModeToggle";
// import SessionCount from "~/components/build/SessionCount";

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
      <h1 className="text-4xl font-mono font-extrabold text-purple-600">
        Welcome to Remix
      </h1>
      <ModeToggle />

      {/* <SessionCount/> */}

      <p className=" font-courgette">
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Asperiores
        quaerat exercitationem cumque modi. Nemo repudiandae officia veniam
        placeat sit fugiat.
      </p>
    </div>
  );
}
