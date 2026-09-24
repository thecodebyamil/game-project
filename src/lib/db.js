import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "db.json");
const USERS_FILE = path.join(DATA_DIR, "users.json");

const SEED_USERS = [
  {
    id: "admin-0001",
    fullName: "Baş Admin",
    name: "Baş Admin",
    email: "admin@gamexstore.az",
    password: bcrypt.hashSync("Admin123!", 10),
    role: "admin",
    balance: 999.0,
    banned: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "usr-admin",
    fullName: "Admin Operator",
    name: "Admin Operator",
    email: "admin@nexus.az",
    password: bcrypt.hashSync("admin123", 10),
    role: "admin",
    balance: 999.0,
    banned: false,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "usr-user",
    fullName: "Amil Məmmədli",
    name: "Amil Məmmədli",
    email: "user@nexus.az",
    password: bcrypt.hashSync("user123", 10),
    role: "user",
    balance: 150.0,
    banned: false,
    createdAt: "2026-08-15T12:00:00.000Z",
  },
];

function ensureDb() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    let initialUsers = [...SEED_USERS];
    if (fs.existsSync(USERS_FILE)) {
      try {
        const rawUsers = JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
        if (Array.isArray(rawUsers) && rawUsers.length > 0) {
          rawUsers.forEach((u) => {
            const email = String(u.email || "").toLowerCase().trim();
            if (!initialUsers.some((x) => x.email === email)) {
              initialUsers.push({
                id: u.id || `user-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
                fullName: u.name || u.fullName || "İstifadəçi",
                name: u.name || u.fullName || "İstifadəçi",
                email,
                password: u.password?.startsWith("$2") ? u.password : bcrypt.hashSync(u.password || "123456", 10),
                role: u.role || "user",
                balance: Number(u.balance) || 0,
                banned: false,
                createdAt: u.createdAt || new Date().toISOString(),
              });
            }
          });
        }
      } catch (e) {
        console.error("Mövcud users.json faylını oxuyarkən xəta:", e);
      }
    }
    const initial = { users: initialUsers, orders: [] };
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), "utf-8");
  }
}

function readDb() {
  ensureDb();
  const raw = fs.readFileSync(DB_FILE, "utf-8");
  try {
    return JSON.parse(raw);
  } catch {
    const initial = { users: [...SEED_USERS], orders: [] };
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), "utf-8");
    return initial;
  }
}

function writeDb(data) {
  ensureDb();
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  // users.json ilə sinxron saxlayırıq
  try {
    const publicUsers = (data.users || []).map((u) => ({
      id: u.id,
      name: u.name || u.fullName || "İstifadəçi",
      email: u.email,
      password: u.password,
      role: u.role,
      balance: u.balance,
      createdAt: u.createdAt,
    }));
    fs.writeFileSync(USERS_FILE, JSON.stringify(publicUsers, null, 2), "utf-8");
  } catch (e) {
    console.error("users.json sinxronizasiyasında xəta:", e);
  }
}

// ---------- Users ----------

export function getAllUsers() {
  return readDb().users;
}

export function findUserByEmail(email) {
  const normalized = String(email || "").trim().toLowerCase();
  return readDb().users.find((u) => u.email.toLowerCase() === normalized);
}

export function findUserById(id) {
  return readDb().users.find((u) => u.id === id);
}

export function createUser({ fullName, email, password }) {
  const db = readDb();
  const existing = db.users.find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase(),
  );
  if (existing) {
    throw new Error("EMAIL_TAKEN");
  }
  const newUser = {
    id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    fullName: fullName?.trim() || "İstifadəçi",
    name: fullName?.trim() || "İstifadəçi",
    email: email.trim().toLowerCase(),
    password: bcrypt.hashSync(password, 10),
    role: "user",
    balance: 50.0, // 50 AZN qeydiyyat bonusu
    banned: false,
    createdAt: new Date().toISOString(),
  };
  db.users.push(newUser);
  writeDb(db);
  return newUser;
}

export function verifyPassword(plain, hashed) {
  if (!plain || !hashed) return false;
  if (hashed.startsWith("$2a$") || hashed.startsWith("$2b$") || hashed.startsWith("$2y$")) {
    try {
      return bcrypt.compareSync(plain, hashed);
    } catch {
      return false;
    }
  }
  return plain === hashed;
}

export function updateUser(id, updates) {
  const db = readDb();
  const idx = db.users.findIndex((u) => u.id === id);
  if (idx === -1) throw new Error("USER_NOT_FOUND");

  const safeUpdates = { ...updates };
  delete safeUpdates.id;
  delete safeUpdates.createdAt;
  if (safeUpdates.password) {
    safeUpdates.password = bcrypt.hashSync(safeUpdates.password, 10);
  }
  if (safeUpdates.name && !safeUpdates.fullName) {
    safeUpdates.fullName = safeUpdates.name;
  }
  if (safeUpdates.fullName && !safeUpdates.name) {
    safeUpdates.name = safeUpdates.fullName;
  }

  db.users[idx] = { ...db.users[idx], ...safeUpdates };
  writeDb(db);
  return db.users[idx];
}

export function deleteUser(id) {
  const db = readDb();
  const before = db.users.length;
  db.users = db.users.filter((u) => u.id !== id);
  writeDb(db);
  return db.users.length < before;
}

export function toPublicUser(user) {
  if (!user) return null;
  const { password, ...publicUser } = user;
  return {
    ...publicUser,
    name: publicUser.name || publicUser.fullName || "İstifadəçi",
    fullName: publicUser.fullName || publicUser.name || "İstifadəçi",
  };
}
