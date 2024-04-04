import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

// "postgresql://postgres:postgrespass@localhost:5432/babblechat?schema=public"

export default function Index() {
  return (
    <div className="">
      <h1 className="text-4xl text-purple-600">Welcome to Remix</h1>
    </div>
  );
}
// prisma init