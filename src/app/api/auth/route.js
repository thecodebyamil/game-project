import { NextResponse } from 'next/server';
import {
  getAllUsers,
  findUserByEmail,
  findUserById,
  createUser,
  verifyPassword,
  updateUser,
  toPublicUser,
} from '@/lib/db';
import { signToken, SESSION_COOKIE, cookieOptions } from '@/lib/auth';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (id) {
      const user = findUserById(id);
      if (!user) {
        return NextResponse.json({ success: false, error: "İstifadəçi tapılmadı" }, { status: 404 });
      }
      return NextResponse.json({ success: true, user: toPublicUser(user) });
    }
    const count = getAllUsers().length;
    return NextResponse.json({ success: true, count });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { action, email, password, name, fullName, id } = body;

    if (action === 'register') {
      const displayName = (name || fullName || '').trim();
      if (!email || !password || !displayName) {
        return NextResponse.json({ success: false, error: "Zəhmət olmasa bütün xanaları doldurun!" }, { status: 400 });
      }

      const existing = findUserByEmail(email);
      if (existing) {
        return NextResponse.json({ success: false, error: "Bu e-poçt ünvanı ilə artıq qeydiyyat mövcuddur!" }, { status: 400 });
      }

      const newUser = createUser({ fullName: displayName, email, password });
      const token = await signToken({ sub: newUser.id, role: newUser.role });

      const response = NextResponse.json({
        success: true,
        user: toPublicUser(newUser),
        message: "Qeydiyyat uğurla tamamlandı! 50 ₼ bonus balans hədiyyə edildi."
      });
      response.cookies.set(SESSION_COOKIE, token, cookieOptions);
      return response;
    }

    if (action === 'login') {
      if (!email || !password) {
        return NextResponse.json({ success: false, error: "E-poçt və şifrə daxil edin!" }, { status: 400 });
      }

      const user = findUserByEmail(email);
      if (!user || !verifyPassword(password, user.password)) {
        return NextResponse.json({ success: false, error: "E-poçt və ya şifrə yanlışdır!" }, { status: 401 });
      }

      if (user.banned) {
        return NextResponse.json({ success: false, error: "Bu hesab bloklanıb." }, { status: 403 });
      }

      const token = await signToken({ sub: user.id, role: user.role });
      const safeUser = toPublicUser(user);

      const response = NextResponse.json({
        success: true,
        user: safeUser,
        message: `Xoş gəldiniz, ${safeUser.name}!`
      });
      response.cookies.set(SESSION_COOKIE, token, cookieOptions);
      return response;
    }

    if (action === 'update_profile') {
      const targetId = id || body.userId;
      if (!targetId) {
        return NextResponse.json({ success: false, error: "İstifadəçi ID tapılmadı!" }, { status: 400 });
      }

      const updates = {};
      if (email && email.trim()) updates.email = email.trim().toLowerCase();
      if (name && name.trim()) {
        updates.name = name.trim();
        updates.fullName = name.trim();
      }
      if (password && password.trim()) updates.password = password.trim();

      const updated = updateUser(targetId, updates);
      return NextResponse.json({
        success: true,
        user: toPublicUser(updated),
        message: "Profil məlumatları uğurla yeniləndi!"
      });
    }

    return NextResponse.json({ success: false, error: "Yanlış sorğu əməliyyatı" }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, name, fullName, email, password } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "İstifadəçi ID tələb olunur!" }, { status: 400 });
    }

    const updates = {};
    if (name) {
      updates.name = name.trim();
      updates.fullName = name.trim();
    }
    if (fullName) {
      updates.name = fullName.trim();
      updates.fullName = fullName.trim();
    }
    if (email) updates.email = email.trim().toLowerCase();
    if (password && password.trim()) updates.password = password.trim();

    const updated = updateUser(id, updates);

    return NextResponse.json({
      success: true,
      user: toPublicUser(updated),
      message: "Profil məlumatları uğurla yeniləndi!"
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
