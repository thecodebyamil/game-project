import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const gamesFilePath = path.join(process.cwd(), 'data', 'games.json');

function getGames() {
  try {
    if (!fs.existsSync(gamesFilePath)) return [];
    return JSON.parse(fs.readFileSync(gamesFilePath, 'utf8'));
  } catch (e) {
    return [];
  }
}

function saveGames(games) {
  try {
    const dir = path.dirname(gamesFilePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(gamesFilePath, JSON.stringify(games, null, 2), 'utf8');
    return true;
  } catch (e) {
    return false;
  }
}

// GET: Bütün oyunları qaytarır
export async function GET() {
  const games = getGames();
  return NextResponse.json({ success: true, games });
}

// POST: Yeni oyun əlavə et (Admin)
export async function POST(request) {
  try {
    const body = await request.json();
    const games = getGames();

    if (!body.title || !body.price) {
      return NextResponse.json({ success: false, error: "Oyun adı və qiyməti mütləqdir" }, { status: 400 });
    }

    const newGame = {
      id: "game-" + Date.now(),
      title: body.title,
      platform: body.platform || "Steam",
      genre: body.genre || "Fəaliyyət",
      rating: Number(body.rating) || 4.8,
      reviews: Number(body.reviews) || 10,
      price: Number(body.price),
      oldPrice: Number(body.oldPrice) || Math.round(Number(body.price) * 1.35 * 100) / 100,
      discount: body.discount || `-${Math.round((1 - Number(body.price)/(Number(body.oldPrice) || (Number(body.price)*1.35))) * 100)}%`,
      image: body.image || "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop",
      tag: body.tag || "Yeni Əlavə",
      badgeColor: body.badgeColor || "from-indigo-500 to-purple-600",
      instantDelivery: body.instantDelivery !== false,
      inStock: body.inStock !== false,
      description: body.description || "Oyun haqqında təsvir qeyd olunmayıb.",
      specs: body.specs || "Minimum tələblər mövcuddur.",
      createdAt: new Date().toISOString()
    };

    games.unshift(newGame);
    saveGames(games);

    return NextResponse.json({ success: true, game: newGame, message: "Oyun uğurla əlavə olundu!" }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// PUT: Oyunu redaktə et (Admin)
export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Oyun ID-si tələb olunur" }, { status: 400 });
    }

    let games = getGames();
    const index = games.findIndex(g => String(g.id) === String(id));

    if (index === -1) {
      return NextResponse.json({ success: false, error: "Oyun tapılmadı" }, { status: 404 });
    }

    games[index] = { ...games[index], ...updates, updatedAt: new Date().toISOString() };
    saveGames(games);

    return NextResponse.json({ success: true, game: games[index], message: "Oyun məlumatları yeniləndi!" });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// DELETE: Oyunu sil (Admin)
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: "Oyun ID tələb olunur" }, { status: 400 });
    }

    let games = getGames();
    const initialLen = games.length;
    games = games.filter(g => String(g.id) !== String(id));

    if (games.length === initialLen) {
      return NextResponse.json({ success: false, error: "Oyun tapılmadı" }, { status: 404 });
    }

    saveGames(games);
    return NextResponse.json({ success: true, message: "Oyun kataloqdan silindi", id });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
