import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

const dbUrl = process.env.DATABASE_URL || process.env.NEXT_PUBLIC_DATABASE_URL || "";
const sql = neon(dbUrl);

export const db = drizzle({ client: sql });
