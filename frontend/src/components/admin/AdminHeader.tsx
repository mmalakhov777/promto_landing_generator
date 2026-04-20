"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";

export function AdminHeader() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/admin/login");
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-white px-6">
      <div />
      <div className="flex items-center gap-4">
        {user && (
          <span className="text-sm text-text-muted">{user.email}</span>
        )}
        <button
          onClick={handleLogout}
          className="rounded-lg border border-border px-3 py-1.5 text-sm text-text-muted hover:bg-surface hover:text-text transition-colors"
        >
          Выйти
        </button>
      </div>
    </header>
  );
}
