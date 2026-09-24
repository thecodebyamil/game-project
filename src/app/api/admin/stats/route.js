import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const cwd = process.cwd();
    const readJson = (file) => {
      try {
        const p = path.join(cwd, 'data', file);
        if (fs.existsSync(p)) return JSON.parse(fs.readFileSync(p, 'utf8'));
      } catch (e) {}
      return [];
    };

    const games = readJson('games.json');
    const accounts = readJson('accounts.json');
    const orders = readJson('orders.json');
    const users = readJson('users.json');

    const totalRevenue = orders
      .filter(o => o.status !== 'Ləğv edildi')
      .reduce((acc, o) => acc + (Number(o.totalAmount) || 0), 0);

    const stats = {
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      totalOrders: orders.length,
      totalUsers: users.length,
      totalGames: games.length,
      totalAccounts: accounts.length,
      recentOrders: orders.slice(0, 5),
    };

    return NextResponse.json({ success: true, stats });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
