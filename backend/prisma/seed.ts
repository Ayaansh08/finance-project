import { PrismaClient, Role, RecordType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

interface SeedProfile {
  salary: number;
  rent: number;
  groceries: number;
  utilities: number;
  transport: number;
  entertainment: number;
  sideIncome: number;
}

const buildUserRecords = (userId: string, profile: SeedProfile) => {
  const rows: Array<{
    amount: number;
    type: RecordType;
    category: string;
    date: Date;
    notes?: string;
    userId: string;
  }> = [];

  for (let month = 1; month <= 12; month += 1) {
    const monthIndex = month - 1;
    const seasonalFactor = 1 + ((month % 3) - 1) * 0.04;

    rows.push({
      amount: Number((profile.salary * seasonalFactor).toFixed(2)),
      type: RecordType.INCOME,
      category: "Salary",
      date: new Date(2025, monthIndex, 1),
      notes: "Monthly salary",
      userId,
    });

    if (month % 2 === 0) {
      rows.push({
        amount: Number((profile.sideIncome * (1 + month * 0.015)).toFixed(2)),
        type: RecordType.INCOME,
        category: "Freelance",
        date: new Date(2025, monthIndex, 11),
        notes: "Contract project",
        userId,
      });
    }

    if (month % 4 === 0) {
      rows.push({
        amount: Number((profile.salary * 0.2).toFixed(2)),
        type: RecordType.INCOME,
        category: "Bonus",
        date: new Date(2025, monthIndex, 25),
        notes: "Quarterly bonus",
        userId,
      });
    }

    rows.push({
      amount: profile.rent,
      type: RecordType.EXPENSE,
      category: "Rent",
      date: new Date(2025, monthIndex, 3),
      notes: "Monthly housing cost",
      userId,
    });

    rows.push({
      amount: Number((profile.groceries * (1 + (month % 2) * 0.05)).toFixed(2)),
      type: RecordType.EXPENSE,
      category: "Groceries",
      date: new Date(2025, monthIndex, 8),
      notes: "Food and home essentials",
      userId,
    });

    rows.push({
      amount: Number((profile.utilities * (1 + (month % 4) * 0.03)).toFixed(2)),
      type: RecordType.EXPENSE,
      category: "Utilities",
      date: new Date(2025, monthIndex, 15),
      notes: "Electricity, water, internet",
      userId,
    });

    rows.push({
      amount: Number((profile.transport * (1 + month * 0.01)).toFixed(2)),
      type: RecordType.EXPENSE,
      category: "Transport",
      date: new Date(2025, monthIndex, 20),
      notes: "Fuel and commute",
      userId,
    });

    if (month % 3 === 0) {
      rows.push({
        amount: Number((profile.entertainment * 1.2).toFixed(2)),
        type: RecordType.EXPENSE,
        category: "Healthcare",
        date: new Date(2025, monthIndex, 24),
        notes: "Quarterly health and medicine expenses",
        userId,
      });
    } else {
      rows.push({
        amount: Number((profile.entertainment * (0.8 + (month % 3) * 0.1)).toFixed(2)),
        type: RecordType.EXPENSE,
        category: "Entertainment",
        date: new Date(2025, monthIndex, 24),
        notes: "Leisure and subscriptions",
        userId,
      });
    }
  }

  return rows;
};

async function main() {
  const passwordHash = await bcrypt.hash("123456", 10);

  // Create users
  const admin = await prisma.user.upsert({
    where: { email: "admin@test.com" },
    create: {
      email: "admin@test.com",
      password: passwordHash,
      role: Role.ADMIN,
    },
    update: {
      password: passwordHash,
      role: Role.ADMIN,
      isActive: true,
    },
  });

  const analyst = await prisma.user.upsert({
    where: { email: "analyst@test.com" },
    create: {
      email: "analyst@test.com",
      password: passwordHash,
      role: Role.ANALYST,
    },
    update: {
      password: passwordHash,
      role: Role.ANALYST,
      isActive: true,
    },
  });

  const viewer = await prisma.user.upsert({
    where: { email: "viewer@test.com" },
    create: {
      email: "viewer@test.com",
      password: passwordHash,
      role: Role.VIEWER,
    },
    update: {
      password: passwordHash,
      role: Role.VIEWER,
      isActive: true,
    },
  });

  const userIds = [admin.id, analyst.id, viewer.id];

  // Reset records for seeded users so reruns stay deterministic.
  await prisma.record.deleteMany({
    where: { userId: { in: userIds } },
  });

  const adminRecords = buildUserRecords(admin.id, {
    salary: 7200,
    rent: 2100,
    groceries: 620,
    utilities: 290,
    transport: 240,
    entertainment: 310,
    sideIncome: 850,
  });

  const analystRecords = buildUserRecords(analyst.id, {
    salary: 5100,
    rent: 1600,
    groceries: 520,
    utilities: 220,
    transport: 180,
    entertainment: 230,
    sideIncome: 520,
  });

  const viewerRecords = buildUserRecords(viewer.id, {
    salary: 3900,
    rent: 1300,
    groceries: 430,
    utilities: 170,
    transport: 140,
    entertainment: 180,
    sideIncome: 300,
  });

  await prisma.record.createMany({
    data: [...adminRecords, ...analystRecords, ...viewerRecords],
  });

  console.log(
    `Seed data created: ${adminRecords.length} admin + ${analystRecords.length} analyst + ${viewerRecords.length} viewer records`,
  );
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
