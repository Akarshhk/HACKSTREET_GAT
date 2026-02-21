import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import {
    createCustomer, listUsers, assignRole,
    type CustomerPayload, type UserRecord, type Role,
} from "@/lib/api";
import ThemeToggle from "@/components/ThemeToggle";
import { Shield, LogOut, PlusCircle, AlertCircle, CheckCircle, Users, ChevronDown } from "lucide-react";

const ACCOUNT_TYPES = ["Savings", "Current", "Fixed Deposit", "NRI"];
const ROLES: Role[] = ["auditor", "teller", "admin"];
const ROLE_COLORS: Record<Role, string> = {
    teller: "text-primary border-primary/40",
    auditor: "text-secondary border-secondary/40",
    admin: "text-amber-400 border-amber-400/40",
};

const EMPTY_FORM: CustomerPayload = { name: "", account_number: "", account_type: "Savings", branch_code: "" };

const inputCls = "w-full px-4 py-2.5 rounded-lg bg-input border border-border text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 transition-colors";

// -----------------------------------------------------------------

const AdminView = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // Customer form
    const [form, setForm] = useState<CustomerPayload>(EMPTY_FORM);
    const [custLoad, setCustLoad] = useState(false);
    const [custErr, setCustErr] = useState<string | null>(null);
    const [custId, setCustId] = useState<string | null>(null);

    // Users table
    const [users, setUsers] = useState<UserRecord[]>([]);
    const [usersLoad, setUsersLoad] = useState(false);
    const [usersErr, setUsersErr] = useState<string | null>(null);
    const [updating, setUpdating] = useState<string | null>(null); // username being updated

    // Role guard
    if (!user) { navigate("/login"); return null; }
    if (user.role !== "admin") { navigate("/dashboard"); return null; }

    // ---------------------------------------------------------------
    const fetchUsers = useCallback(async () => {
        setUsersLoad(true);
        setUsersErr(null);
        try {
            const data = await listUsers(user.token);
            setUsers(data);
        } catch (e: any) {
            setUsersErr(e.message);
        } finally {
            setUsersLoad(false);
        }
    }, [user.token]);

    useEffect(() => { fetchUsers(); }, [fetchUsers]);

    // ---------------------------------------------------------------
    const handleCustomer = async (e: React.FormEvent) => {
        e.preventDefault();
        setCustLoad(true); setCustErr(null); setCustId(null);
        try {
            const res = await createCustomer(form, user.token);
            setCustId(res.id);
            setForm(EMPTY_FORM);
        } catch (err: any) { setCustErr(err.message); }
        finally { setCustLoad(false); }
    };

    const handleRoleChange = async (username: string, newRole: Role) => {
        setUpdating(username);
        try {
            await assignRole(username, newRole, user.token);
            setUsers((prev) => prev.map((u) => u.username === username ? { ...u, role: newRole } : u));
        } catch (e: any) { setUsersErr(e.message); }
        finally { setUpdating(null); }
    };

    // ---------------------------------------------------------------
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen flex flex-col">

            {/* Header */}
            <header className="glass-strong border-b border-border/50 sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <Shield className="w-5 h-5 text-primary" />
                        <span className="font-semibold text-sm tracking-tight">SecureBank</span>
                        <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-mono font-semibold border border-amber-400/40 text-amber-400">Admin</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                        <button onClick={() => { logout(); navigate("/"); }}
                            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                            <LogOut className="w-4 h-4" />
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-10 space-y-12">

                {/* ── USER MANAGEMENT ─────────────────────────────────── */}
                <section>
                    <div className="flex items-center gap-2 mb-6">
                        <Users className="w-5 h-5 text-amber-400" />
                        <h2 className="text-xl font-bold tracking-tight">User Management</h2>
                    </div>

                    {usersErr && (
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm mb-4">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" /> {usersErr}
                        </div>
                    )}

                    <div className="glass rounded-xl overflow-hidden">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border/50">
                                    <th className="px-5 py-3 text-left text-xs uppercase text-muted-foreground tracking-wider">Username</th>
                                    <th className="px-5 py-3 text-left text-xs uppercase text-muted-foreground tracking-wider">Current Role</th>
                                    <th className="px-5 py-3 text-left text-xs uppercase text-muted-foreground tracking-wider">Assign Role</th>
                                    <th className="px-5 py-3 text-left text-xs uppercase text-muted-foreground tracking-wider hidden sm:table-cell">Joined</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usersLoad ? (
                                    [...Array(3)].map((_, i) => (
                                        <tr key={i} className="border-b border-border/30">
                                            {[...Array(4)].map((_, j) => (
                                                <td key={j} className="px-5 py-4">
                                                    <div className="h-4 rounded bg-muted animate-pulse w-24" />
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                ) : users.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-5 py-8 text-center text-muted-foreground text-sm">No users found</td>
                                    </tr>
                                ) : (
                                    users.map((u) => (
                                        <tr key={u.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                                            <td className="px-5 py-3.5 font-medium">{u.username}</td>
                                            <td className="px-5 py-3.5">
                                                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold font-mono border ${ROLE_COLORS[u.role] ?? "text-muted-foreground border-border"}`}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <div className="relative inline-block">
                                                    <select
                                                        value={u.role}
                                                        disabled={updating === u.username}
                                                        onChange={(e) => handleRoleChange(u.username, e.target.value as Role)}
                                                        className="appearance-none pl-3 pr-8 py-1.5 rounded-lg bg-input border border-border text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors disabled:opacity-50 cursor-pointer"
                                                    >
                                                        {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                                                    </select>
                                                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                                                    {updating === u.username && (
                                                        <span className="absolute -right-6 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-5 py-3.5 text-muted-foreground text-xs hidden sm:table-cell">
                                                {new Date(u.created_at).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* ── ADD CUSTOMER ────────────────────────────────────── */}
                <section>
                    <div className="flex items-center gap-2 mb-6">
                        <PlusCircle className="w-5 h-5 text-primary" />
                        <h2 className="text-xl font-bold tracking-tight">Add Customer Record</h2>
                    </div>
                    <p className="text-muted-foreground text-sm -mt-4 mb-6">Encrypted and indexed automatically — never stored in plaintext.</p>

                    {custId && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm mb-4">
                            <CheckCircle className="w-4 h-4 flex-shrink-0" />
                            Customer created — ID: <span className="font-mono ml-1">{custId}</span>
                        </motion.div>
                    )}
                    {custErr && (
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm mb-4">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" /> {custErr}
                        </div>
                    )}

                    <div className="glass rounded-xl p-6">
                        <form onSubmit={handleCustomer} className="grid sm:grid-cols-2 gap-4">
                            {[
                                { label: "Full Name", field: "name", placeholder: "e.g. Rahul Verma" },
                                { label: "Account Number", field: "account_number", placeholder: "e.g. ACC123456" },
                                { label: "Branch Code", field: "branch_code", placeholder: "e.g. BLR01" },
                            ].map(({ label, field, placeholder }) => (
                                <div key={field}>
                                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">{label}</label>
                                    <input
                                        type="text" required placeholder={placeholder}
                                        value={(form as any)[field]}
                                        onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
                                        className={inputCls}
                                    />
                                </div>
                            ))}

                            <div>
                                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Account Type</label>
                                <select value={form.account_type} onChange={(e) => setForm((f) => ({ ...f, account_type: e.target.value }))} className={inputCls}>
                                    {ACCOUNT_TYPES.map((t) => <option key={t}>{t}</option>)}
                                </select>
                            </div>

                            <div className="sm:col-span-2">
                                <button type="submit" disabled={custLoad}
                                    className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm btn-glow disabled:opacity-40 flex items-center justify-center gap-2 transition-all">
                                    {custLoad
                                        ? <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                                        : <><PlusCircle className="w-4 h-4" /> Encrypt & Store Customer</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </section>

            </main>
        </motion.div>
    );
};

export default AdminView;
