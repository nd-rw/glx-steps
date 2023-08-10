import type { V2_MetaFunction } from "@remix-run/node";
import type { User } from "@prisma/client";
import { json } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { getEveryonesStepEntries } from "~/models/stepEntry.server";

import { dateFormatter, numberFormatter, useOptionalUser } from "~/utils";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/table";

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
      [] as { user: Pick<User, "email" | "id" | "name">; steps: number }[],
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
          <Table>
            <TableHeader>
              <TableHead>Rank</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Steps</TableHead>
            </TableHeader>
            <TableBody>
              {leaderboardData.map((summary, i) => (
                <TableRow key={summary.user.email}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell className="font-bold">
                    {summary.user.name}{" "}
                    <span className="text-gray-400 font-normal">
                      ({summary.user.email})
                    </span>
                  </TableCell>
                  <TableCell>{numberFormatter.format(summary.steps)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <h2 className="font-bold text-xl pt-24">Recent Step Entries</h2>
        <Table>
          <TableHeader>
            <TableHead>Name</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Steps</TableHead>
          </TableHeader>
          <TableBody>
            {data.everyonesStepEntryListItems
              .sort(
                (a, b) =>
                  new Date(b.date).getTime() - new Date(a.date).getTime(),
              )
              .map((entry) => (
                <TableRow key={entry.user.email}>
                  <TableCell className="font-bold">
                    {entry.user.name}{" "}
                    <span className="text-gray-400 font-normal">
                      ({entry.user.email})
                    </span>
                  </TableCell>
                  <TableCell>
                    {dateFormatter.format(new Date(entry.date))}
                  </TableCell>
                  <TableCell>
                    {numberFormatter.format(entry.numSteps)}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </main>
  );
}
