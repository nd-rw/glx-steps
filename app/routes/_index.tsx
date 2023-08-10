import type { V2_MetaFunction } from "@remix-run/node";
import type { User } from "@prisma/client";
import { json } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { getEveryonesStepEntries } from "~/models/stepEntry.server";

import { numberFormatter, useOptionalUser } from "~/utils";

export const meta: V2_MetaFunction = () => [{ title: "GLX Steps" }];

export const loader = async () => {
  const everyonesStepEntryListItems = await getEveryonesStepEntries();
  return json({ everyonesStepEntryListItems });
};

export default function Index() {
  const data = useLoaderData<typeof loader>();
  const user = useOptionalUser();

  const leaderboardData = data.everyonesStepEntryListItems
    .reduce(
      (acc, entry) => {
        const existing = acc.find((e) => e.user.id === entry.user.id);
        if (existing) {
          existing.steps += entry.numSteps;
        } else {
          acc.push({
            user: entry.user,
            steps: entry.numSteps,
          });
        }
        return acc;
      },
      [] as { user: Pick<User, "email" | "id">; steps: number }[],
    )
    // Sort highest steps to lowest
    .sort((a, b) => b.steps - a.steps);

  return (
    <main className="relative min-h-screen flex flex-col">
      <div className="p-8 space-y-8 max-w-4xl w-full mx-auto">
        <div className="flex justify-between items-end w-full">
          <h1 className="font-light text-6xl">
            <span className="font-black">GLX</span> Steps
          </h1>

          <div className="flex space-x-2">
            {user ? (
              <>
                <Link to="/stepEntries" className="btn btn-default">
                  Edit My Step Entries
                </Link>
                <Form action="/logout" method="post">
                  <button type="submit" className="btn btn-secondary">
                    Logout
                  </button>
                </Form>
              </>
            ) : (
              <div className="flex space-x-2">
                <Link to="/join" className="btn btn-secondary">
                  Sign up
                </Link>
                <Link to="/login" className="btn btn-default">
                  Log In
                </Link>
              </div>
            )}
          </div>
        </div>
        {leaderboardData.length === 0 ? (
          <p className="p-4">No step entries yet</p>
        ) : (
          <ol>
            {leaderboardData.map((userStepSummary, i) => (
              <li key={userStepSummary.user.email}>
                <p>
                  🚶 #{i + 1} - {userStepSummary.user.email} -{" "}
                  {numberFormatter.format(userStepSummary.steps)}
                </p>
              </li>
            ))}
          </ol>
        )}
      </div>
    </main>
  );
}
