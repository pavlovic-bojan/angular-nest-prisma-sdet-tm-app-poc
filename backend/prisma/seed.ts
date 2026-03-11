import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const demoUser = await prisma.user.upsert({
    where: { email: "demo@example.com" },
    update: {},
    create: {
      name: "Demo User",
      email: "demo@example.com",
      password: "password123",
      role: "admin",
    },
  });

  await prisma.user.upsert({
    where: { email: "jane@example.com" },
    update: {},
    create: {
      name: "Jane Doe",
      email: "jane@example.com",
      password: "changeme",
      role: "developer",
    },
  });

  await prisma.user.upsert({
    where: { email: "john@example.com" },
    update: {},
    create: {
      name: "John Smith",
      email: "john@example.com",
      password: "changeme",
      role: "developer",
    },
  });

  const project1 =
    (await prisma.project.findFirst({ where: { name: "Angular Task Manager" } })) ??
    (await prisma.project.create({
      data: {
        name: "Angular Task Manager",
        description: "Main project for task management app",
      },
    }));

  const project2 =
    (await prisma.project.findFirst({ where: { name: "Side Project" } })) ??
    (await prisma.project.create({
      data: {
        name: "Side Project",
        description: "Personal side project",
      },
    }));

  const existingTasks = await prisma.task.count();
  if (existingTasks === 0) {
    await prisma.task.createMany({
      data: [
        {
          title: "Setup project",
          description: "Initialize Angular project with Tailwind",
          status: "done",
          priority: "high",
          projectId: project1.id,
          assigneeId: demoUser.id,
        },
        {
          title: "Implement auth",
          description: "Add login/logout with mock user",
          status: "in-progress",
          priority: "high",
          projectId: project1.id,
          assigneeId: demoUser.id,
        },
        {
          title: "Create task list",
          description: "Build task CRUD functionality",
          status: "todo",
          priority: "medium",
          projectId: project1.id,
        },
      ],
    });
  }

  console.log("Seed completed successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
