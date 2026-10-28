import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";

type User = { id: number; email: string; name: string };

//c.set / c.getで扱う値の型を定義
type Env = {
  Variables: {
    user: User;
  };
};

const app = new Hono<Env>();

//固定ユーザー
// ※パスワードを平文で持つのは学習用の仮実装
const USERS = [
  { id: 1, email: "test@example.com", password: "password123", name: "たけし" },
];

//セッションストア: sessionId -> userId
const sessions = new Map<string, number>();

//認証ミドルウェア
const requireAuth = createMiddleware<Env>(async (c, next) => {
  const sessionId = getCookie(c, "session_id");
  const userId = sessionId ? sessions.get(sessionId) : undefined;
  const found = USERS.find((u) => u.id === userId);

  if (!found) {
    return c.json({ message: "ログインが必要です" }, 401);
  }

  c.set("user", { id: found.id, email: found.email, name: found.name });
  await next();
});

// app.use("/api/*", requireAuth);

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
app.get("/me", requireAuth, (c) => {
  return c.json(c.get("user"));
});

// app.get("/api/me", (c) => {
//   return c.json(c.get("user"));
// });

app.get("/secret", requireAuth, (c) => {
  const user = c.get("user");
  return c.json({ message: `${user.name}さん専用のページです` });
});

// app.get("/api/secret", (c) => {
//   const user = c.get("user");
//   return c.json({ message: `${user.name}さん専用のページです` });
// });

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
