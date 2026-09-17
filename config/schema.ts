import { integer, json, pgTable, text, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  credits: integer().default(10),
  plan: varchar({ length: 50 }).default("free"),
  bloodGroup: varchar({ length: 20 }).default("O+"),
  allergies: text().default("None"),
  emergencyContact: varchar({ length: 100 }).default(""),
  preferredVoice: varchar({ length: 100 }).default("Elliot (Male - Warm)"),
});

export const familyMembersTable = pgTable("familyMembersTable", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  memberId: varchar({ length: 100 }).notNull().unique(),
  primaryUserEmail: varchar({ length: 255 })
    .notNull()
    .references(() => usersTable.email),
  name: varchar({ length: 255 }).notNull(),
  relationship: varchar({ length: 50 }).notNull().default("Self"), // Self, Spouse, Child, Parent, Sibling, Other
  age: integer(),
  gender: varchar({ length: 50 }),
  bloodGroup: varchar({ length: 20 }).default("O+"),
  allergies: text().default("None"),
  medicalHistory: text().default("None"),
  createdAt: varchar({ length: 100 }),
});

export const SessionChatTable = pgTable("sessionChatTable", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  sessionId: varchar().notNull(),
  notes: text(),
  selectedDoctor: json(),
  conversation: json(),
  report: json(),
  createdBy: varchar().references(() => usersTable.email),
  createdOn: varchar(),
  familyMemberId: varchar({ length: 100 }),
});

export const medicalReportsTable = pgTable("medicalReportsTable", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  reportId: varchar({ length: 100 }).notNull().unique(),
  userEmail: varchar({ length: 255 })
    .notNull()
    .references(() => usersTable.email),
  fileName: varchar({ length: 255 }),
  reportTitle: varchar({ length: 255 }).notNull(),
  testDate: varchar({ length: 100 }),
  patientSummary: text(),
  parameters: json(), // Array of { name, value, referenceRange, status, interpretation, unit }
  deficienciesOrAbnormalities: json(), // Array of string
  suggestedNextSteps: json(), // Array of string
  rawText: text(),
  createdAt: varchar({ length: 100 }),
  familyMemberId: varchar({ length: 100 }),
});

export const appointmentsTable = pgTable("appointmentsTable", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  appointmentId: varchar({ length: 100 }).notNull().unique(),
  primaryUserEmail: varchar({ length: 255 })
    .notNull()
    .references(() => usersTable.email),
  familyMemberId: varchar({ length: 100 }),
  patientName: varchar({ length: 255 }),
  doctorId: varchar({ length: 100 }).notNull(),
  doctorName: varchar({ length: 255 }).notNull(),
  specialization: varchar({ length: 255 }).notNull(),
  appointmentDate: varchar({ length: 100 }).notNull(),
  timeSlot: varchar({ length: 50 }).notNull(),
  consultationType: varchar({ length: 100 }).notNull().default("Voice AI Consultation"),
  status: varchar({ length: 50 }).notNull().default("Scheduled"),
  chiefComplaint: text(),
  createdAt: varchar({ length: 100 }),
});
