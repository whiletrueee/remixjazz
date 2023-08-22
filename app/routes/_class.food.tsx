import { PrismaClient } from "@prisma/client";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { commitSession, getSession } from "~/sessions";

export async function loader({ request }: LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  try {
    const prisma = new PrismaClient();
    const foodItems = await prisma.food.findMany();
    return json(foodItems, {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  } catch (error) {
    return null;
  }
}

export async function action({ request }: ActionArgs) {
  const foodItems: any[] = [];
  const session = await getSession(request.headers.get("Cookie"));
  const body = await request.formData();
  body.forEach((value, key) => {
    if (value !== "") foodItems.push({ [key]: value });
  });
  const foodItemsPrices = foodItems.reduce((acc, item, index) => {
    if (index % 2 === 0) {
      const foodItem = Object.values(item)[0];
      const foodPrice = Object.values(foodItems[index + 1])[0];
      acc.push({ name: foodItem, price: Number(foodPrice) });
    }
    return acc;
  }, []);
  try {
    const prisma = new PrismaClient();
    const createMany = await prisma.food.createMany({
      data: foodItemsPrices,
    });
    return json(createMany, {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  } catch (error) {
    console.log(error);
    return json({ error });
  }
}

export default function ClasssFood() {
  const loaderData = useLoaderData();
  const actionData = useActionData();
  const [foodItems, setFooditems] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

  useEffect(() => {
    if (actionData === undefined) {
      setFooditems((prev) => prev.slice(0, loaderData.length));
    } else {
      setFooditems((prev) => prev.slice(0, actionData.count));
    }
  }, [actionData]);

  return (
    <div className="w-full mt-4">
      <div className="flex flex-wrap gap-2 mb-6">
        {loaderData !== null &&
          loaderData.map(
            (item: { id: number; name: string; price: number }) => {
              return (
                <div
                  className="flex items-center gap-2 w-fit px-3 py-1 bg-transpaernt border-2 border-slate-600 rounded-full"
                  key={item.id}
                >
                  <div>{item.name}</div>
                  <div>{item.price}</div>
                </div>
              );
            }
          )}
      </div>
      <div className="flex justify-between items-center">
        <Form method="post" className="flex flex-col gap-2">
          {foodItems.map((item) => (
            <div
              key={`food-item-${item}`}
              className="flex justify-between gap-2"
            >
              <input
                name={`food-item-${item}`}
                type="text"
                placeholder="Enter Food"
                className=" outline-none text-slate-900 font-medium text-lg rounded-md px-3 py-1 w-[60%]"
              />
              <input
                name={`food-price-${item}`}
                type="number"
                min="0"
                placeholder="Enter Price"
                className=" outline-none text-slate-900 font-medium text-lg rounded-md px-3 py-1 w-[40%]"
              />
            </div>
          ))}
          <div className="flex flex-col gap-4 mt-4">
            {/* <button
              className=" bg-transparent text-slate-900 w-full py-1 rounded-md border-2 border-slate-900"
              onClick={() => {
                if (foodItems.length < 10)
                  setFooditems([...foodItems, foodItems.length + 1]);
              }}
            >
              + Add Food
            </button> */}
            <button
              type="submit"
              className=" bg-slate-700 text-white w-full py-1 rounded-md text-center"
            >
              Save
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
