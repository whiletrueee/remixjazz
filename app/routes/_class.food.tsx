import type { LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { commitSession, getSession } from "~/sessions";

export async function loader({ request }: LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  if (!session.has("username")) {
    // Redirect to login page if not authenticated.
    return redirect("/"); // Redirect to your login page.
  }
  const username = session.get("username");

  return json(
    { username },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    }
  );
}

export default function ClasssFood() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="w-full">
      <div className="flex justify-between items-center px-4">
        <div className="">{data.username}</div>
      </div>
    </div>
  );
}
