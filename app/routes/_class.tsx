import type { LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useLocation } from "@remix-run/react";
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

export default function MainClass() {
  const location = useLocation();
  const data = useLoaderData<typeof loader>();
  return (
    <div className="font-bold flex flex-col gap-3">
      <div className="text-slate-500 flex justify-between items-center">
        <div className="text-md">{data.username}</div>
        <Link
          to={"/logout"}
          className=" bg-slate-500 rounded-md px-2 py-1 text-md font-semibold text-slate-200"
        >
          Logout
        </Link>
      </div>
      <div className="flex justify-between">
        <Link
          to="/food"
          className={`text-center w-[47%] ${
            location.pathname === "/food"
              ? "bg-slate-900 text-white"
              : "bg-slate-400/30 text-slate-900"
          } text-lg py-1 rounded-lg`}
        >
          Food
        </Link>
        <Link
          to="/people"
          className={`text-center w-[47%] ${
            location.pathname === "/people"
              ? "bg-slate-900 text-white"
              : "bg-slate-400/30 text-slate-900"
          } text-lg py-1 rounded-lg`}
        >
          People
        </Link>
      </div>
      <Outlet />
    </div>
  );
}
