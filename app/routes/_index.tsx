import type { MetaFunction,  } from "@remix-run/node";
import prisma from "~/lib/db";
import { json } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"

export const meta: MetaFunction = () => {
  return [
    { title: "Babble chat" },
    { name: "description", content: "Elevate your conversations, embrace the future of messaging." },
  ];
};

export const loader = async () => {
  // await prisma.user.create({
  //   data: {
  //     email: "legacyEmpilre*@gmail.com",
  //     name:"Ayomide Adebisi"
  //   }
  // })
  return json(await prisma.user.deleteMany());
};
// pnpm add remix-auth-form

export default function Index() {
  const data = useLoaderData<typeof loader>();
  console.log(data);
  
  return (
    <div className="">
      <h1 className="text-4xl font-extrabold text-purple-600">Welcome to Remix</h1>
    </div>
  );
}