import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";

import {
  getEveryonesStepEntries,
  getStepEntryListItems,
} from "~/models/stepEntry.server";
import { requireUserId } from "~/session.server";
import { dateFormatter, useUser } from "~/utils";

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await requireUserId(request);
  const stepEntryListItems = await getStepEntryListItems({ userId });
  const everyonesStepEntryListItems = await getEveryonesStepEntries();
  console.log(
    "🚀 ~ loader ~ everyonesStepEntryListItems:",
    everyonesStepEntryListItems,
  );
  return json({ stepEntryListItems });
};

export default function StepEntriesPage() {
  const data = useLoaderData<typeof loader>();
  const user = useUser();

  return (
    <div className="flex h-full min-h-screen flex-col max-w-4xl mx-auto border-x bg-gray-50">
      <header className="flex items-center justify-between bg-gray-200 p-4 text-gray-900">
        <div className="flex space-x-4">
          <Link to="/" className="btn btn-default">
            Back Home
          </Link>
          <h1 className="text-3xl font-bold">
            <Link to=".">My Steps</Link>
          </h1>
        </div>
        <p>{user.email}</p>
        <div className="flex space-x-2">
          <Link to="/user/edit" className="btn btn-secondary">
            Edit Name ({user.name})
          </Link>
          <Form action="/logout" method="post">
            <button type="submit" className="btn btn-secondary">
              Logout
            </button>
          </Form>
        </div>
      </header>

      <main className="flex h-full">
        <div className="h-full w-80 border-r bg-gray-50">
          <Link to="new" className="block p-4 text-xl text-violet-500">
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
                      `block border-b p-4 text-xl ${
                        isActive ? "bg-violet-100" : ""
                      }`
                    }
                    to={stepEntry.id}
                  >
                    🚶 {dateFormatter.format(new Date(stepEntry.date))}
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
