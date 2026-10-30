const API_URL = "http://localhost:3000";

export type User = { id: number; email: string; name: string };

export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });
  const data = (await res.json()) as { message: string };
  return { ok: res.ok, message: data.message };
}

export async function fetchMe(): Promise<User | null> {
  const res = await fetch(`${API_URL}/api/me`, { credentials: "include" });
  if (!res.ok) return null;
  return res.json();
}

export async function logout() {
  await fetch(`${API_URL}/logout`, { method: "POST", credentials: "include" });
}
