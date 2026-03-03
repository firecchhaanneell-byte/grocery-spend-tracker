"use client";

import { useEffect, useState } from "react";

type Expense = {
  id: string;
  spent_at: string;
  amount_cents: number;
  store: string | null;
  category: string | null;
  note: string | null;
};

export default function Home() {
  const [spentAt, setSpentAt] = useState(() => new Date().toISOString().slice(0, 10));
  const [amount, setAmount] = useState("");
  const [store, setStore] = useState("");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");

  const [items, setItems] = useState<Expense[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    setErr(null);
    const r = await fetch("/api/expenses");
    const j = await r.json();
    if (!j.ok) setErr(j.error || "Ошибка загрузки");
    else setItems(j.data);
  }

  useEffect(() => {
    load();
  }, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    const amount_cents = Math.round(Number(amount) * 100);

    const r = await fetch("/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        spent_at: spentAt,
        amount_cents,
        store,
        category,
        note,
      }),
    });

    setLoading(false);

    if (!r.ok) {
      const j = await r.json().catch(() => ({}));
      setErr(j.error || "Ошибка добавления");
      return;
    }

    setAmount("");
    setStore("");
    setCategory("");
    setNote("");
    await load();
  }

  return (
    <main className="min-h-screen p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold">Траты на продукты</h1>

      <form onSubmit={add} className="mt-6 grid gap-3 rounded-2xl border p-4">
        <div className="grid gap-2 sm:grid-cols-2">
          <label className="grid gap-1 text-sm">
            Дата
            <input className="rounded-lg border px-3 py-2" type="date" value={spentAt} onChange={(e) => setSpentAt(e.target.value)} />
          </label>

          <label className="grid gap-1 text-sm">
            Сумма (руб)
            <input className="rounded-lg border px-3 py-2" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="например 245.50" />
          </label>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <label className="grid gap-1 text-sm">
            Магазин
            <input className="rounded-lg border px-3 py-2" value={store} onChange={(e) => setStore(e.target.value)} placeholder="Пятёрочка" />
          </label>

          <label className="grid gap-1 text-sm">
            Категория
            <input className="rounded-lg border px-3 py-2" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="овощи/молочка/мясо" />
          </label>
        </div>

        <label className="grid gap-1 text-sm">
          Комментарий
          <input className="rounded-lg border px-3 py-2" value={note} onChange={(e) => setNote(e.target.value)} placeholder="что купил" />
        </label>

        {err && <p className="text-sm text-red-600">{err}</p>}

        <button disabled={loading} className="rounded-lg border px-3 py-2 font-medium">
          {loading ? "Добавляю..." : "Добавить"}
        </button>
      </form>

      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Последние записи</h2>
          <button className="text-sm underline" onClick={load}>
            Обновить
          </button>
        </div>

        <div className="mt-3 grid gap-2">
          {items.map((x) => (
            <div key={x.id} className="rounded-xl border p-3">
              <div className="flex justify-between gap-3">
                <div>
                  <div className="font-medium">
                    {(x.amount_cents / 100).toFixed(2)} ₽
                  </div>
                  <div className="text-sm opacity-70">
                    {x.spent_at} • {x.store || "—"} • {x.category || "—"}
                  </div>
                </div>
                <div className="text-sm opacity-70">{x.note || ""}</div>
              </div>
            </div>
          ))}
          {items.length === 0 && <p className="opacity-70">Пока пусто</p>}
        </div>
      </div>
    </main>
  );
}