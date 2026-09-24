import { NextResponse } from "next/server";
import { getAllUsers, updateUser, deleteUser, toPublicUser } from "@/lib/db";
import { requireAdmin } from "@/lib/requireAdmin";

export async function GET() {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, error: "İcazə yoxdur" }, { status: 403 });
    }
    const users = getAllUsers().map(toPublicUser);
    return NextResponse.json({ success: true, users });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, error: "İcazə yoxdur" }, { status: 403 });
    }

    const body = await request.json();
    const { id, name, fullName, email, balance, role, password } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "İstifadəçi ID tələb olunur" }, { status: 400 });
    }

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (fullName !== undefined) updates.fullName = fullName;
    if (email !== undefined) updates.email = email;
    if (balance !== undefined) updates.balance = Number(balance);
    if (role !== undefined) updates.role = role;
    if (password !== undefined && String(password).trim() !== "") {
      updates.password = String(password).trim();
    }

    const updatedUser = updateUser(id, updates);

    return NextResponse.json({
      success: true,
      user: toPublicUser(updatedUser),
      message: "İstifadəçi məlumatları uğurla yeniləndi!"
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, error: "İcazə yoxdur" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: "İstifadəçi ID tələb olunur" }, { status: 400 });
    }

    if (id === admin.id) {
      return NextResponse.json({ success: false, error: "Öz hesabınızı silə bilməzsiniz!" }, { status: 400 });
    }

    const ok = deleteUser(id);
    if (!ok) {
      return NextResponse.json({ success: false, error: "İstifadəçi tapılmadı" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "İstifadəçi uğurla silindi!" });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
