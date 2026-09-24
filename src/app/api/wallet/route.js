import { NextResponse } from 'next/server';
import { findUserById, updateUser, toPublicUser } from '@/lib/db';

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, amount, paymentMethod } = body;

    if (!userId || !amount || Number(amount) <= 0) {
      return NextResponse.json({ success: false, error: "Düzgün istifadəçi və məbləğ tələb olunur" }, { status: 400 });
    }

    const user = findUserById(userId);
    if (!user) {
      return NextResponse.json({ success: false, error: "İstifadəçi tapılmadı" }, { status: 404 });
    }

    const added = Number(amount);
    const newBalance = Math.round(((Number(user.balance) || 0) + added) * 100) / 100;
    const updatedUser = updateUser(userId, { balance: newBalance });

    return NextResponse.json({
      success: true,
      user: toPublicUser(updatedUser),
      message: `${added.toFixed(2)} ₼ məbləğində balansınız uğurla artırıldı! (${paymentMethod || 'Kart'})`
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
