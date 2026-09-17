import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { pgTable, integer, varchar, text } from "drizzle-orm/pg-core";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local" });

const dbUrl = process.env.DATABASE_URL || process.env.NEXT_PUBLIC_DATABASE_URL;

if (!dbUrl) {
  console.error("No DATABASE_URL found");
  process.exit(1);
}

const sql = neon(dbUrl);
const db = drizzle({ client: sql });

const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
});

const vitalsTable = pgTable("vitalsTable", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  vitalId: varchar({ length: 100 }).notNull().unique(),
  primaryUserEmail: varchar({ length: 255 }).notNull(),
  familyMemberId: varchar({ length: 100 }),
  patientName: varchar({ length: 255 }).notNull(),
  heartRate: integer(),
  bpSystolic: integer(),
  bpDiastolic: integer(),
  bloodOxygen: integer(),
  temperature: varchar({ length: 50 }),
  bloodGlucose: integer(),
  status: varchar({ length: 50 }).notNull(),
  notes: text(),
  recordedAt: varchar({ length: 100 }),
  createdAt: varchar({ length: 100 }),
});

async function main() {
  console.log("Fetching users from database...");
  const users = await db.select().from(usersTable);

  if (!users.length) {
    console.log("No users found.");
    return;
  }

  const primaryUser = users[0];
  console.log("Seeding sample vitals for user:", primaryUser.email);

  const nowISO = new Date().toISOString();
  const yesterdayISO = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const samples = [
    {
      vitalId: `vital_sample_${Date.now()}_1`,
      primaryUserEmail: primaryUser.email,
      familyMemberId: null,
      patientName: primaryUser.name || "Primary User",
      heartRate: 72,
      bpSystolic: 120,
      bpDiastolic: 80,
      bloodOxygen: 98,
      temperature: "98.6",
      bloodGlucose: 95,
      status: "Normal",
      notes: "Morning routine check. All metrics optimal.",
      recordedAt: nowISO,
      createdAt: nowISO,
    },
    {
      vitalId: `vital_sample_${Date.now()}_2`,
      primaryUserEmail: primaryUser.email,
      familyMemberId: null,
      patientName: primaryUser.name || "Primary User",
      heartRate: 88,
      bpSystolic: 132,
      bpDiastolic: 86,
      bloodOxygen: 97,
      temperature: "99.1",
      bloodGlucose: 110,
      status: "Elevated",
      notes: "Post evening workout reading.",
      recordedAt: yesterdayISO,
      createdAt: yesterdayISO,
    },
  ];

  for (const sample of samples) {
    await db.insert(vitalsTable).values(sample);
    console.log(`Inserted vital reading: BP ${sample.bpSystolic}/${sample.bpDiastolic}, HR ${sample.heartRate}`);
  }

  console.log("Sample vitals seeded successfully!");
}

main().catch((err) => {
  console.error("Error seeding vitals:", err);
  process.exit(1);
});
