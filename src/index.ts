import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";

const app = new Hono();

//固定ユーザー
// ※パスワードを平文で持つのは学習用の仮実装
const USERS = [
  { id: 1, email: "test@example.com", password: "password123", name: "たけし" },
];

//セッションストア: sessionId -> userId
const sessions = new Map<string, number>();

//ログイン
app.post("/login", async (c) => {
  const { email, password } = await c.req.json<{
    email: string;
    password: string;
  }>();

  const user = USERS.find((u) => u.email === email && u.password === password);
  if (!user) {
    return c.json({ message: "メールアドレスかパスワードが違います" }, 401);
  }

  const sessionId = crypto.randomUUID();
  sessions.set(sessionId, user.id);

  setCookie(c, "session_id", sessionId, {
    httpOnly: true,
    secure: false,
    sameSite: "Lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  return c.json({ message: "ログインしました" });
});

//ログイン中のユーザー情報
app.get("/me", (c) => {
  const sessionId = getCookie(c, "session_id");
  if (!sessionId) {
    return c.json({ message: "未ログインです" }, 401);
  }

  const userId = sessions.get(sessionId);
  const user = USERS.find((u) => u.id === userId);
  if (!user) {
    return c.json({ message: "セッションが無効です" }, 401);
  }

  return c.json({ id: user.id, email: user.email, name: user.name });
});

//ログアウト
app.post("/logout", (c) => {
  const sessionId = getCookie(c, "session_id");
  if (sessionId) sessions.delete(sessionId);

  deleteCookie(c, "session_id", { path: "/" });
  return c.json({ message: "ログアウトしました" });
});

serve({ fetch: app.fetch, port: 3000 }, (info) => {
  console.log(`http://localhost:${info.port}`);
});
