import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const accountsFilePath = path.join(process.cwd(), 'data', 'accounts.json');

function getAccounts() {
  try {
    if (!fs.existsSync(accountsFilePath)) return [];
    return JSON.parse(fs.readFileSync(accountsFilePath, 'utf8'));
  } catch (e) {
    return [];
  }
}

function saveAccounts(accounts) {
  try {
    const dir = path.dirname(accountsFilePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(accountsFilePath, JSON.stringify(accounts, null, 2), 'utf8');
    return true;
  } catch (e) {
    return false;
  }
}

export async function GET() {
  const accounts = getAccounts();
  return NextResponse.json({ success: true, accounts });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const accounts = getAccounts();

    if (!body.title || !body.price || !body.game) {
      return NextResponse.json({ success: false, error: "Oyun növü, başlıq və qiymət mütləqdir!" }, { status: 400 });
    }

    const newAccount = {
      id: "acc-" + Date.now(),
      game: body.game,
      title: body.title,
      rank: body.rank || "Qeyd olunmayıb",
      region: body.region || "Qlobal",
      accessType: body.accessType || "Tam Giriş (Mail Dəyişir)",
      warranty: body.warranty || "Zəmanətli",
      price: Number(body.price),
      oldPrice: Number(body.oldPrice) || Math.round(Number(body.price) * 1.35 * 100) / 100,
      image: body.image || "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop",
      status: body.status || (body.isUserCreated ? "İstifadəçi Elanı" : "Yoxlanılmış Hesab"),
      inventory: Array.isArray(body.inventory) ? body.inventory : (body.inventory ? String(body.inventory).split(',').map(s => s.trim()) : []),
      createdBy: body.createdBy || "Qonaq",
      contact: body.contact || "",
      isUserCreated: body.isUserCreated !== false,
      credentials: {
        username: body.credentials?.username || "login_kod_veriləcək",
        password: body.credentials?.password || "sifre_avtomatik_veriləcək",
        mailAccess: body.credentials?.mailAccess || "E-poçt təhvil verilir"
      },
      createdAt: new Date().toISOString()
    };

    accounts.unshift(newAccount);
    saveAccounts(accounts);

    return NextResponse.json({ success: true, account: newAccount, message: "Hesab uğurla əlavə edildi!" }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Hesab ID tələb olunur" }, { status: 400 });
    }

    let accounts = getAccounts();
    const index = accounts.findIndex(a => String(a.id) === String(id));

    if (index === -1) {
      return NextResponse.json({ success: false, error: "Hesab tapılmadı" }, { status: 404 });
    }

    accounts[index] = { ...accounts[index], ...updates, updatedAt: new Date().toISOString() };
    saveAccounts(accounts);

    return NextResponse.json({ success: true, account: accounts[index], message: "Hesab məlumatları yeniləndi!" });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: "Hesab ID tələb olunur" }, { status: 400 });
    }

    let accounts = getAccounts();
    const initialLen = accounts.length;
    accounts = accounts.filter(a => String(a.id) !== String(id));

    if (accounts.length === initialLen) {
      return NextResponse.json({ success: false, error: "Hesab tapılmadı" }, { status: 404 });
    }

    saveAccounts(accounts);
    return NextResponse.json({ success: true, message: "Hesab uğurla silindi", id });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
