// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------
export type Role = "teller" | "auditor" | "admin";

export const ROLE_LABELS: Record<Role, string> = {
  teller: "Bank Staff (Teller)",
  auditor: "Compliance Auditor",
  admin: "Administrator",
};

export interface User {
  username: string;
  role: Role;
  token: string;
}

export interface StaffResult {
  name: string;
  account_number: string;
  account_type: string;
  branch_code: string;
}

export interface AuditorResult {
  record_id: string;
}

export type SearchResult = StaffResult | AuditorResult;

// ------------------------------------------------------------------
// Switch — set to true to develop without a running backend
// ------------------------------------------------------------------
const USE_MOCK_API = false;

// ------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------
const BASE = "";   // Vite proxy handles /auth, /search, /customers

function authHeader(token: string) {
  return { Authorization: `Bearer ${token}` };
}

// ------------------------------------------------------------------
// Auth
// ------------------------------------------------------------------
export async function login(username: string, password: string): Promise<User> {
  if (USE_MOCK_API) return mockLogin(username, password);

  const res = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail ?? "Login failed");
  }
  const data = await res.json();
  // backend returns: { access_token, token_type, role, username }
  return { username: data.username, role: data.role as Role, token: data.access_token };
}

export async function register(username: string, password: string): Promise<void> {
  const res = await fetch(`${BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail ?? "Registration failed");
  }
}

// ------------------------------------------------------------------
// Search
// ------------------------------------------------------------------
export async function search(query: string, user: User): Promise<SearchResult[]> {
  if (USE_MOCK_API) return mockSearch(query, user.role);

  const res = await fetch(`${BASE}/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader(user.token) },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail ?? "Search failed");
  }
  const data = await res.json();
  return data.results as SearchResult[];
}

// ------------------------------------------------------------------
// Customers (admin only)
// ------------------------------------------------------------------
export interface CustomerPayload {
  name: string;
  account_number: string;
  account_type: string;
  branch_code: string;
}

export async function createCustomer(payload: CustomerPayload, token: string): Promise<{ id: string }> {
  const res = await fetch(`${BASE}/customers`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader(token) },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail ?? "Failed to create customer");
  }
  return res.json();
}

export interface UserRecord {
  id: string;
  username: string;
  role: Role;
  created_at: string;
}

export async function listUsers(token: string): Promise<UserRecord[]> {
  const res = await fetch(`${BASE}/customers/users`, {
    headers: authHeader(token),
  });
  if (!res.ok) throw new Error("Failed to fetch users");
  const data = await res.json();
  return data.users as UserRecord[];
}

export async function assignRole(username: string, role: Role, token: string): Promise<void> {
  const res = await fetch(`${BASE}/customers/users/${username}/role`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeader(token) },
    body: JSON.stringify({ role }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail ?? "Failed to update role");
  }
}

// ------------------------------------------------------------------
// Mock implementations (USE_MOCK_API = true)
// ------------------------------------------------------------------
const MOCK_CUSTOMERS = [
  { id: "REC-001", name: "Rahul Sharma", account_number: "ACC123456", account_type: "Savings", branch_code: "BR-MUM-01" },
  { id: "REC-002", name: "Priya Patel", account_number: "ACC789012", account_type: "Current", branch_code: "BR-DEL-03" },
  { id: "REC-003", name: "Amit Kumar", account_number: "ACC345678", account_type: "Savings", branch_code: "BR-BLR-02" },
  { id: "REC-004", name: "Sneha Gupta", account_number: "ACC901234", account_type: "Fixed Deposit", branch_code: "BR-CHN-01" },
];

const MOCK_USERS: Record<string, { password: string; role: Role }> = {
  teller1: { password: "password123", role: "teller" },
  auditor1: { password: "password123", role: "auditor" },
  admin1: { password: "password123", role: "admin" },
};

function delay(ms: number) { return new Promise((r) => setTimeout(r, ms)); }

async function mockLogin(username: string, password: string): Promise<User> {
  await delay(600);
  const u = MOCK_USERS[username];
  if (!u || u.password !== password) throw new Error("Invalid credentials");
  return { username, role: u.role, token: `mock-jwt-${username}` };
}

async function mockSearch(query: string, role: Role): Promise<SearchResult[]> {
  await delay(800);
  const q = query.toLowerCase();
  const matches = MOCK_CUSTOMERS.filter(
    (c) => c.name.toLowerCase().includes(q) || c.account_number.toLowerCase().includes(q)
  );

  if (role === "teller") return matches.map((c) => ({
    name: c.name, account_number: c.account_number,
    account_type: c.account_type, branch_code: c.branch_code,
  }));

  if (role === "auditor") return matches.map((c) => ({ record_id: c.id }));

  return [];
}
