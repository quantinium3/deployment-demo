import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db } from "./db/index.js";
import { eq, sql } from "drizzle-orm";
import { todosTable } from "./db/schema.js";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

const app = new Hono();

await migrate(db, { migrationsFolder: "./drizzle" });

app.get("/health", async (c) => {
  try {
    await db.execute(sql`select 1`)
    return c.json({
      "status": "ok"
    }, 200)
  } catch (err) {
    console.error("failed to get health: ", err)
    return c.json({
      "status": "unhealthy",
    }, 500)
  }
})

app.get("/api/todos", async (c) => {
  try {
    const todos = await db.select().from(todosTable);
    return c.json({
      "todos": todos
    }, 200);
  } catch (err) {
    console.error("failed to get todos: ", err)
    return c.json({
      "error": `failed to get todos`
    }, 500)
  }
});

const todoSchema = z.object({
  text: z.string().min(1)
})

app.post("/api/todos", zValidator("json", todoSchema), async (c) => {
  try {
    const data = c.req.valid("json")
    await db.insert(todosTable).values({ text: data.text });
    return c.json({
      "status": "successfully added todo"
    }, 201);
  } catch (err) {
    console.error("failed to add todo: ", err)
    return c.json({
      "error": "failed to add todo"
    }, 500)
  }
});

app.delete("/api/todos/:id", async (c) => {
  try {
    const id = c.req.param("id");
    if (id === "") {
      return c.json({
        "error": "id is not present"
      }, 400)
    }
    await db.delete(todosTable).where(eq(todosTable.id, id));
    return c.json({
      "status": "todo deleted successfully"
    }, 200);
  } catch (err) {
    console.error("failed to delete todo: ", err)
    return c.json({
      "error": "failed to delete todo"
    }, 500)
  }
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
