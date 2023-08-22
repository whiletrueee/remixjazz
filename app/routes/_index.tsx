import { json, redirect } from "@remix-run/node";
import type { LoaderArgs, ActionArgs, V2_MetaFunction } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { PrismaClient } from "@prisma/client";
import { commitSession, getSession } from "~/sessions";
export const meta: V2_MetaFunction = () => {
  return [
    { title: "Jazz" },
    { name: "description", content: "Welcome to Jazz!" },
  ];
};

export async function loader({ request }: LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  if (session.has("username")) {
    // Redirect to the home page if they are already signed in.
    return redirect("/food");
  }
  return json(
    { data: "session not found" },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    }
  );
}

export async function action({ request }: ActionArgs) {
  const email = (await request.formData()).get("email");
  const validateEmail =
    (email as string)?.includes("@") &&
    (email as string)?.includes(".") &&
    (email as string)?.length > 5 &&
    (email as string)?.length < 50;

  const session = await getSession(request.headers.get("Cookie"));

  if (!validateEmail) {
    return json(
      { error: "Invalid Mail Address" },
      {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      }
    );
  }
  const prisma = new PrismaClient();

  try {
    const user = await prisma.users.findFirst({
      where: {
        email: email as string,
      },
    });

    if (user?.id) {
      session.set("username", user.email.split("@")[0]);
      return redirect("/food", {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      });
    }

    const uploadUser = await prisma.users.create({
      data: {
        email: email as string,
      },
    });

    if (uploadUser.id) {
      session.set("username", uploadUser.email.split("@")[0]);
      return redirect("/food", {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      });
    }
  } catch (err) {
    return json(err, {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }
}

export default function Index() {
  const actionData = useActionData<typeof action>();
  return (
    <Form method="post">
      <div className="flex flex-col justify-center items-center gap-5">
        <input
          name="email"
          type="text"
          placeholder="enter email"
          className=" outline-none text-slate-900 font-medium text-lg rounded-md px-3 py-1 w-60 border-2 border-slate-700"
        />
        <button
          type="submit"
          className=" bg-slate-700 text-white w-40 py-1 rounded-md"
        >
          Open App
        </button>
        {actionData && <div>actionData</div>}
      </div>
    </Form>
  );
}
