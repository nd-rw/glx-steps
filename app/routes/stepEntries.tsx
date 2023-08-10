import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";

import { getEveryonesStepEntries, getStepEntryListItems } from "~/models/stepEntry.server";
import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await requireUserId(request);
  const stepEntryListItems = await getStepEntryListItems({ userId });
  const everyonesStepEntryListItems = await getEveryonesStepEntries();
  console.log("🚀 ~ loader ~ everyonesStepEntryListItems:", everyonesStepEntryListItems)
  return json({ stepEntryListItems });
};

export default function StepEntriesPage() {
  const data = useLoaderData<typeof loader>();
  const user = useUser();

  return (
    <div className="flex h-full min-h-screen flex-col">
      <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
        <h1 className="text-3xl font-bold">
          <Link to=".">Steps</Link>
        </h1>
        <p>{user.email}</p>
        <Form action="/logout" method="post">
          <button
            type="submit"
            className="rounded bg-slate-600 px-4 py-2 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
          >
            Logout
          </button>
        </Form>
      </header>

      <main className="flex h-full bg-white">
        <div className="h-full w-80 border-r bg-gray-50">
          <Link to="new" className="block p-4 text-xl text-blue-500">
            + New Step Entry
          </Link>

          <hr />

          {data.stepEntryListItems.length === 0 ? (
            <p className="p-4">No step entries yet</p>
          ) : (
            <ol>
              {data.stepEntryListItems.map((stepEntry) => (
                <li key={stepEntry.id}>
                  <NavLink
                    className={({ isActive }) =>
                      `block border-b p-4 text-xl ${isActive ? "bg-white" : ""}`
                    }
                    to={stepEntry.id}
                  >
                    🚶 {stepEntry.date}
                </NavLink>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
