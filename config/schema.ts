import { integer, json, pgTable, text, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  credits: integer(),
});

export const SessionChatTable = pgTable("sessionChatTable", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  sessionId: varchar({ length: 255 }).notNull(),
  notes: text(),
  conversation: json(),
  doctorAgent: json(),
  createdBy: varchar({ length: 255 }).notNull(),
  createdOn: varchar({ length: 255 }),
});
