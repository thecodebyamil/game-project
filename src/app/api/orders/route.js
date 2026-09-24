import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const ordersFilePath = path.join(process.cwd(), 'data', 'orders.json');
const usersFilePath = path.join(process.cwd(), 'data', 'users.json');

function getOrders() {
  try {
    if (!fs.existsSync(ordersFilePath)) return [];
    return JSON.parse(fs.readFileSync(ordersFilePath, 'utf8'));
  } catch (e) {
    return [];
  }
}

function saveOrders(orders) {
  try {
    const dir = path.dirname(ordersFilePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(ordersFilePath, JSON.stringify(orders, null, 2), 'utf8');
    return true;
  } catch (e) {
    return false;
  }
}

function getUsers() {
  try {
    if (!fs.existsSync(usersFilePath)) return [];
    return JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
  } catch (e) {
    return [];
  }
}

function saveUsers(users) {
  try {
    const dir = path.dirname(usersFilePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), 'utf8');
    return true;
  } catch (e) {
    return false;
  }
}

// Random CD Key generator
function generateLicenseKey(title) {
  const code = (title || "NEXUS").replace(/[^a-zA-Z0-9]/g, '').substring(0, 4).toUpperCase();
  const randPart = () => Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${code || "GAME"}-${randPart()}-${randPart()}-${randPart()}`;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const orders = getOrders();

    if (userId) {
      const userOrders = orders.filter(o => o.userId === userId);
      return NextResponse.json({ success: true, orders: userOrders });
    }

    return NextResponse.json({ success: true, orders });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, userName, userEmail, items, paymentMethod, contact } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, error: "Səbət boşdur" }, { status: 400 });
    }

    const totalAmount = items.reduce((acc, item) => acc + Number(item.price), 0);
    const users = getUsers();
    let updatedUser = null;

    // If paying via user wallet balance
    if (paymentMethod === 'Balans') {
      if (!userId) {
        return NextResponse.json({ success: false, error: "Balansla ödəniş üçün daxil olmalısınız!" }, { status: 401 });
      }

      const userIndex = users.findIndex(u => u.id === userId);
      if (userIndex === -1) {
        return NextResponse.json({ success: false, error: "İstifadəçi tapılmadı" }, { status: 404 });
      }

      if (Number(users[userIndex].balance) < totalAmount) {
        return NextResponse.json({ 
          success: false, 
          error: `Balansınızda kifayət qədər vəsait yoxdur! Cari balans: ${Number(users[userIndex].balance).toFixed(2)} ₼, Tələb olunan: ${totalAmount.toFixed(2)} ₼` 
        }, { status: 400 });
      }

      // Deduct balance
      users[userIndex].balance = Math.round((Number(users[userIndex].balance) - totalAmount) * 100) / 100;
      saveUsers(users);
      const { password: _, ...safe } = users[userIndex];
      updatedUser = safe;
    }

    // Attach generated delivery credentials for each item
    const deliveredItems = items.map(item => {
      const isAccount = item.type === 'Hesab' || item.credentials;
      return {
        ...item,
        deliveredKey: isAccount ? null : generateLicenseKey(item.title),
        deliveredAccount: isAccount ? {
          username: item.credentials?.username || "nexus_user_" + Math.floor(1000 + Math.random() * 9000),
          password: item.credentials?.password || "NexusPass!" + Math.floor(100 + Math.random() * 900),
          instruction: "Email və şifrə dərhal dəyişdirilə bilər. Dəstək: @nexus_support"
        } : null
      };
    });

    const newOrder = {
      id: "ORD-" + Math.floor(100000 + Math.random() * 900000),
      userId: userId || "guest",
      userName: userName || "Qonaq İstifadəçi",
      userEmail: userEmail || "musteri@nexus.az",
      contact: contact || "",
      items: deliveredItems,
      totalAmount: Math.round(totalAmount * 100) / 100,
      paymentMethod: paymentMethod || "M10",
      status: "Tamamlandı",
      createdAt: new Date().toISOString()
    };

    const orders = getOrders();
    orders.unshift(newOrder);
    saveOrders(orders);

    return NextResponse.json({
      success: true,
      order: newOrder,
      updatedUser,
      message: "Sifarişiniz uğurla rəsmiləşdirildi və rəqəmsal açar təqdim olundu!"
    }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// PUT: Sifariş statusunu dəyiş (Admin)
export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ success: false, error: "Sifariş ID və status mütləqdir" }, { status: 400 });
    }

    let orders = getOrders();
    const index = orders.findIndex(o => String(o.id) === String(id));

    if (index === -1) {
      return NextResponse.json({ success: false, error: "Sifariş tapılmadı" }, { status: 404 });
    }

    orders[index].status = status;
    orders[index].updatedAt = new Date().toISOString();
    saveOrders(orders);

    return NextResponse.json({ success: true, order: orders[index], message: "Sifariş statusu yeniləndi!" });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
