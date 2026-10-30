import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { fetchMe, logout } from "../lib/api";

export const Route = createFileRoute("/mypage")({
  loader: () => fetchMe(),
  component: MyPage,
});

function MyPage() {
  const user = Route.useLoaderData();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate({ to: "/login" });
  };

  if (!user) return <p>未ログインです</p>;

  return (
    <div>
      <h1>マイページ</h1>
      <p>{user.name}さん、こんにちは</p>
      <button onClick={handleLogout}>ログアウト</button>
    </div>
  );
}
