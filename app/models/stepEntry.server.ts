import type { User, StepEntry } from "@prisma/client";

import { prisma } from "~/db.server";

export function getStepEntry({
  id,
  userId,
}: Pick<StepEntry, "id"> & {
  userId: User["id"];
}) {
  return prisma.stepEntry.findFirst({
    select: { id: true, numSteps: true, date: true, linkToPhoto: true },
    where: { id, userId },
  });
}

export function getEveryonesStepEntries() {
  return prisma.stepEntry.findMany({
    select: {
      id: true,
      numSteps: true,
      date: true,
      linkToPhoto: true,
      user: { select: { id: true, email: true, name: true } },
    },
    orderBy: { date: "desc" },
  });
}

export function getStepEntryListItems({ userId }: { userId: User["id"] }) {
  return prisma.stepEntry.findMany({
    where: { userId },
    select: { id: true, numSteps: true, date: true, linkToPhoto: true },
    orderBy: { date: "desc" },
  });
}

export function getPreviousStepEntryDates({ userId }: { userId: User["id"] }) {
  return prisma.stepEntry.findMany({
    where: { userId },
    select: { date: true},
    orderBy: { date: "desc" },
  });
}

export function createStepEntry({
  numSteps,
  date,
  linkToPhoto,
  userId,
}: Pick<StepEntry, "numSteps" | "date" | "linkToPhoto"> & {
  userId: User["id"];
}) {
  return prisma.stepEntry.create({
    data: {
      numSteps,
      date,
      linkToPhoto,
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
