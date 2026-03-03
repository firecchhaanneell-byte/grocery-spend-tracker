"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";

function LoginForm() {
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const search = useSearchParams();
  const next = search.get("next") || "/";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    const r = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    setLoading(false);

    if (r.ok) {
      window.location.href = next;
      return;
    }

    setErr("Неверный пароль");
  }

  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-sm rounded-2xl border p-6 shadow"
    >
      <h1 className="text-xl font-semibold">Вход</h1>
      <p className="text-sm opacity-70 mt-1">Введите пароль, чтобы открыть сайт</p>

      <label className="block mt-4 text-sm">Пароль</label>
      <input
        type="password"
        className="mt-1 w-full rounded-lg border px-3 py-2"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoFocus
      />

      {err && <p className="text-sm mt-2 text-red-600">{err}</p>}

      <button
        type="submit"
        disabled={loading}
        className="mt-4 w-full rounded-lg border px-3 py-2 font-medium"
      >
        {loading ? "Проверяю..." : "Войти"}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <Suspense fallback={<div className="opacity-70">Загрузка...</div>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}