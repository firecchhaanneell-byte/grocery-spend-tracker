import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET() {
  const { data, error } = await supabaseServer
    .from("expenses")
    .select("*")
    .order("spent_at", { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, data });
}

export async function POST(req: Request) {
  const body = await req.json();

  const spent_at = body.spent_at as string;
  const amount_cents = Number(body.amount_cents);
  const store = (body.store ?? "") as string;
  const category = (body.category ?? "") as string;
  const note = (body.note ?? "") as string;

  if (!spent_at || !Number.isFinite(amount_cents)) {
    return NextResponse.json({ ok: false, error: "Invalid input" }, { status: 400 });
  }

  const { error } = await supabaseServer.from("expenses").insert([
    { spent_at, amount_cents, store, category, note },
  ]);

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}