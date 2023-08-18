import type { User } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
import { numberFormatter } from "./utils";
import { useState } from "react";
import type { getEveryonesStepEntries } from "./models/stepEntry.server";
import type { SerializeFrom } from "@remix-run/node";

interface Props {
  data: SerializeFrom<Awaited<ReturnType<typeof getEveryonesStepEntries>>>;
}

export function Leaderboards({ data }: Props) {
  const [mode, setMode] = useState<"Total" | "Most in a Day">("Total");

  if (data.length === 0) {
    return <p className="p-4">No step entries yet</p>;
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex w-full justify-between items-center">
        <h2 className="text-xl font-bold">Leaderboard</h2>
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value as any)}
          className="px-2 py-1 border border-gray-300 rounded-md rounded w-[150px]"
        >
          <option value="Total">Total</option>
          <option value="Most in a Day">Most in a Day</option>
        </select>
      </div>

      {mode === "Total" ? (
        <TotalLeaderboard data={data} />
      ) : mode === "Most in a Day" ? (
        <MostInADayLeaderboard data={data} />
      ) : null}
    </div>
  );
}

function TotalLeaderboard({ data }: Props) {
  const leaderboardData = data
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
              <span className="font-normal text-gray-400">
                ({summary.user.email})
              </span>
            </TableCell>
            <TableCell>{numberFormatter.format(summary.steps)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function MostInADayLeaderboard({ data }: Props) {
  const leaderboardData = data
    .reduce(
      (acc, entry) => {
        const existing = acc.find((e) => e.user.id === entry.user.id);
        if (existing && existing.steps < entry.numSteps) {
          existing.steps = entry.numSteps;
        } else if (!existing) {
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
              <span className="font-normal text-gray-400">
                ({summary.user.email})
              </span>
            </TableCell>
            <TableCell>{numberFormatter.format(summary.steps)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
