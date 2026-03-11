import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono();
app.use(
  "*",
  cors({
    origin: "http://localhost:5173",
  }),
);

app.get("/api/fortune", async (c) => {
  try {
    const res = await fetch("https://aphorismcookie.herokuapp.com");
    const data = await res.json();
    return c.json({
      message: data.data.message,
    });
  } catch (err) {
    console.error("failed to fetch fortune cookie");
    return c.json({
      error: "failed to fetch fortune :(",
    });
  }
});

export default app;
