import { pgTable, uuid, text, boolean, timestamp } from "drizzle-orm/pg-core";

export const todosTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  text: text("text").notNull(),
  completed: boolean("completed").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
