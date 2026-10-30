import { createRootRoute, Link, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <div
      style={{
        maxWidth: 360,
        margin: "0 auto",
        padding: 24,
        fontFamily: "sans-serif",
      }}
    >
      <nav style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <Link to="/">トップ</Link>
        <Link to="/login">ログイン</Link>
        <Link to="/mypage">マイページ</Link>
      </nav>
      {/* ここに各ページが表示される */}
      <Outlet />
    </div>
  );
}
