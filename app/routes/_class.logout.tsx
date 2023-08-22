import { redirect, type ActionArgs } from "@remix-run/node";
import { Form, Link } from "@remix-run/react";
import { destroySession, getSession } from "~/sessions";

export async function action({ request }: ActionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  return redirect("/", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}

export default function Logout() {
  return (
    <div className="flex flex-col justify-between items-center gap-3 mt-14">
      <div className=" text-lg text-slate-800 font-bold">
        Are you sure to Logout ?
      </div>
      <Form method="post">
        <button className=" bg-slate-600 text-slate-300 px-2 py-1 rounded-md" type="submit">Logout</button>
      </Form>
      <Link to="/food">Never Mind</Link>
    </div>
  );
}
