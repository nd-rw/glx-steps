import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";

import { getEveryonesStepEntries } from "~/models/stepEntry.server";
import { useUser } from "~/utils";

export const loader = async ({ request }: LoaderArgs) => {
  const everyonesStepEntryListItems = await getEveryonesStepEntries();
  return json({ everyonesStepEntryListItems });
};

export default function LeaderboardPage() {
  const data = useLoaderData<typeof loader>();
  const user = useUser();

  const leaderboardData = data.everyonesStepEntryListItems.map((stepEntry) => {
    return {
      email: stepEntry.user.email,
      steps: stepEntry.numSteps,
    };
  });

  // group leaderboardData by email and sum steps
  const groupedLeaderboardData = leaderboardData.reduce((acc, curr) => {
    const found = acc.find((item) => item.email === curr.email);
    if (found) {
      found.steps += curr.steps;
    } else {
      acc.push(curr);
    }
    return acc;
  }, []).sort((a, b) =>  b.steps - a.steps) as { email: string; steps: number }[];
  
  console.log("🚀 ~ groupedLeaderboardData ~ groupedLeaderboardData:", groupedLeaderboardData)
  

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

      <main className="flex justify-center items-center h-screen bg-white">
        <div className="h-full border-r bg-gray-50 p-5">
          <hr />

          {groupedLeaderboardData.length === 0 ? (
            <p className="p-4">No step entries yet</p>
          ) : (
            <ol>
              {groupedLeaderboardData.map((userStepSummary, idx) => (
                <li key={userStepSummary.email}>
                  <p
                  >
                    🚶 #{idx + 1} - {userStepSummary.email} - {userStepSummary.steps}
                </p>
                </li>
              ))}
            </ol>
          )}
        </div>
      </main>
    </div>
  );
}
