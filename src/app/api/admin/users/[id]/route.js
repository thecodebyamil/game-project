import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import { findUserById, updateUser, deleteUser, toPublicUser } from "@/lib/db";

const ALLOWED_FIELDS = ["role", "banned", "balance", "fullName"];

export async function PATCH(request, { params }) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "İcazə yoxdur." }, { status: 403 });
  }

  const { id } = await params;
  const target = findUserById(id);
  if (!target) {
    return NextResponse.json(
      { error: "İstifadəçi tapılmadı." },
      { status: 404 },
    );
  }

  if (target.id === admin.id) {
    return NextResponse.json(
      { error: "Öz hesabınızı admin panelindən dəyişə bilməzsiniz." },
      { status: 400 },
    );
  }

  const body = await request.json();
  const updates = {};
  for (const key of ALLOWED_FIELDS) {
    if (key in body) updates[key] = body[key];
  }

  if ("role" in updates && !["user", "admin"].includes(updates.role)) {
    return NextResponse.json({ error: "Yanlış rol." }, { status: 400 });
  }
  if ("balance" in updates) {
    const bal = Number(updates.balance);
    if (Number.isNaN(bal) || bal < 0) {
      return NextResponse.json({ error: "Yanlış balans." }, { status: 400 });
    }
    updates.balance = bal;
  }

  const updated = updateUser(id, updates);
  return NextResponse.json({ user: toPublicUser(updated) });
}

export async function DELETE(request, { params }) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "İcazə yoxdur." }, { status: 403 });
  }

  const { id } = await params;
  if (id === admin.id) {
    return NextResponse.json(
      { error: "Öz hesabınızı silə bilməzsiniz." },
      { status: 400 },
    );
  }

  const ok = deleteUser(id);
  if (!ok) {
    return NextResponse.json(
      { error: "İstifadəçi tapılmadı." },
      { status: 404 },
    );
  }
  return NextResponse.json({ ok: true });
}
