import type { User, StepEntry } from "@prisma/client";

import { prisma } from "~/db.server";

export function getStepEntry({
  id,
  userId,
}: Pick<StepEntry, "id"> & {
  userId: User["id"];
}) {
  return prisma.stepEntry.findFirst({
    select: { id: true, numSteps: true, date: true },
    where: { id, userId },
  });
}


export function getEveryonesStepEntries() {
  return prisma.stepEntry.findMany({
    select: { id: true, numSteps: true, date: true, user: {select: { email: true} }},
    orderBy: { date: "desc" },
  });
}

export function getStepEntryListItems({ userId }: { userId: User["id"] }) {
  return prisma.stepEntry.findMany({
    where: { userId },
    select: { id: true, numSteps: true, date: true },
    orderBy: { date: "desc" },
  });
}

export function createStepEntry({
  numSteps,
  date,
  userId,
}: Pick<StepEntry, "numSteps" | "date"> & {
  userId: User["id"];
}) {
  return prisma.stepEntry.create({
    data: {
      numSteps,
      date,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export function deleteStepEntry({
  id,
  userId,
}: Pick<StepEntry, "id"> & { userId: User["id"] }) {
  return prisma.stepEntry.deleteMany({
    where: { id, userId },
  });
}
