import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db } from "./db/index.js";
import { eq } from "drizzle-orm";
import { todosTable } from "./db/schema.js";
import { todo } from "node:test";

const app = new Hono();

await migrate(db, { migrationsFolder: "./drizzle" });

app.get("/health", (c) =>
  c.json({
    status: "ok",
  }),
);

app.get("/api/todos", async (c) => {
  const todos = await db.select().from(todosTable);
  return c.json(todos);
});

app.post("/api/todos", async (c) => {
  const { text } = await c.req.json();
  const [todo] = await db.insert(todosTable).values({ text }).returning();
  return c.json(todo);
});

app.delete("/api/todos/:id", async (c) => {
  const id = c.req.param("id");
  await db.delete(todosTable).where(eq(todosTable.id, id));
  return c.json({ success: true });
});

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
