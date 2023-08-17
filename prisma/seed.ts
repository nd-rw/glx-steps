import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import addDays from "date-fns/addDays";

const prisma = new PrismaClient();

async function seed() {
  const email = "rachel@remix.run";

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  const getRandomNumSteps = (min: number, max: number) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

  const hashedPassword = await bcrypt.hash("racheliscool", 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
      name: "Rachel",
    },
  });

  await prisma.stepEntry.create({
    data: {
      date: new Date(),
      numSteps: getRandomNumSteps(0, 30000),
      userId: user.id,
      linkToPhoto: "https://i.imgur.com/0y8Ftya.jpg",
    },
  });

  await prisma.stepEntry.create({
    data: {
      date: addDays(new Date(), 1),
      numSteps: getRandomNumSteps(0, 30000),
      userId: user.id,
      linkToPhoto: "https://i.imgur.com/0y8Ftya.jpg",
    },
  });

  await prisma.stepEntry.create({
    data: {
      date: addDays(new Date(), 2),
      numSteps: getRandomNumSteps(0, 30000),
      userId: user.id,
      linkToPhoto: "https://i.imgur.com/0y8Ftya.jpg",
    },
  });

  await prisma.stepEntry.create({
    data: {
      date: addDays(new Date(), 3),
      numSteps: getRandomNumSteps(0, 30000),
      userId: user.id,
      linkToPhoto: "https://i.imgur.com/0y8Ftya.jpg",
    },
  });

  await prisma.stepEntry.create({
    data: {
      date: addDays(new Date(), 4),
      numSteps: getRandomNumSteps(0, 30000),
      userId: user.id,
      linkToPhoto: "https://i.imgur.com/0y8Ftya.jpg",
    },
  });

  await prisma.stepEntry.create({
    data: {
      date: addDays(new Date(), 5),
      numSteps: getRandomNumSteps(0, 30000),
      userId: user.id,
      linkToPhoto: "https://i.imgur.com/0y8Ftya.jpg",
    },
  });

  await prisma.stepEntry.create({
    data: {
      date: addDays(new Date(), 6),
      numSteps: getRandomNumSteps(0, 30000),
      userId: user.id,
      linkToPhoto: "https://i.imgur.com/0y8Ftya.jpg",
    },
  });

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
