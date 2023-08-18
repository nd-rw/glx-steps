import type { V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { getEveryonesStepEntries } from "~/models/stepEntry.server";

import { dateFormatter, numberFormatter, useOptionalUser } from "~/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/table";
import { Leaderboards } from "~/leaderboards";

export const meta: V2_MetaFunction = () => [{ title: "GLX Steps" }];

export const loader = async () => {
  const everyonesStepEntryListItems = await getEveryonesStepEntries();
  return json({ everyonesStepEntryListItems });
};

export default function Index() {
  const data = useLoaderData<typeof loader>();
  const user = useOptionalUser();

  return (
    <main className="relative flex min-h-screen flex-col">
      <div className="mx-auto w-full max-w-4xl space-y-8 p-8">
        <div className="flex w-full items-end justify-between">
          <h1 className="text-6xl font-light">
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

        <Leaderboards data={data.everyonesStepEntryListItems ?? []} />

        <h2 className="pt-24 text-xl font-bold">Recent Step Entries</h2>
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
                    <span className="font-normal text-gray-400">
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
