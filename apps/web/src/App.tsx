import { useState, type FormEvent } from "react";

const API_URL = "http://localhost:3000";

type User = { id: number; email: string; name: string };

function App() {
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("password123");
  const [user, setUser] = useState<User | null>(null);
  const [message, setMessage] = useState("");

  const login = async (e: FormEvent) => {
    e.preventDefault();
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    setMessage(data.message);
  };

  const fetchMe = async () => {
    const res = await fetch(`${API_URL}/api/me`);
    if (!res.ok) {
      setUser(null);
      setMessage("未ログインです");
      return;
    }
    setUser(await res.json());
  };

  const logout = async () => {
    const res = await fetch(`${API_URL}/logout`, { method: "POST" });
    const data = await res.json();
    setUser(null);
    setMessage(data.message);
  };

  return (
    <main
      style={{
        margin: "0 auto",
        maxWidth: 360,
        padding: 24,
        fontFamily: "sans-serif",
      }}
    >
      <h1>認証テスト</h1>

      <form onSubmit={login} style={{ display: "grid", gap: 8, maxWidth: 320 }}>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password"
        />
        <button type="submit">ログイン</button>
      </form>

      <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
        <button onClick={fetchMe}>自分の情報を取得（/api/me）</button>
        <button onClick={logout}>ログアウト</button>
      </div>

      <p>メッセージ：{message}</p>
      <pre>{user ? JSON.stringify(user, null, 2) : "ユーザー情報なし"}</pre>
    </main>
  );
}

export default App;
