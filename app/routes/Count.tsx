import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getSession, commitSession } from "~/services/countSession";

export const loader = async ({ request }: { request: Request }) => {
  const session = await getSession(request.headers.get("Cookie"));

  const numberOfVisits: number = session.get("numberOfVisits") + 1 || 1;

  session.set("numberOfVisits", numberOfVisits);
  const numberOfVisitsCookie = await commitSession(session);

  console.log(session.data);
  
  return json(
    { numberOfVisits },
    {
      headers: {
        "Set-Cookie": numberOfVisitsCookie,
      },
    }
  );  
};

const SessionCount = () => {
  const data = useLoaderData();
  return (
    <>
      <p className="text-primary text-3xl font-bold">Session Count</p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </>
  );
};

export default SessionCount;
