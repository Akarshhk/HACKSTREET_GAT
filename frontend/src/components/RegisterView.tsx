import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import ThemeToggle from "@/components/ThemeToggle";
import { UserPlus, Lock, User, AlertCircle, Shield, CheckCircle } from "lucide-react";

const RegisterView = () => {
    const { register, isLoading, error } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [success, setSuccess] = useState(false);
    const [localErr, setLocalErr] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalErr(null);

        if (password !== confirm) {
            setLocalErr("Passwords do not match");
            return;
        }
        if (password.length < 6) {
            setLocalErr("Password must be at least 6 characters");
            return;
        }

        try {
            await register(username, password);
            setSuccess(true);
            setTimeout(() => navigate("/login"), 1800);
        } catch { }
    };

    const displayError = localErr ?? error;

    return (
        <div className="min-h-screen flex flex-col">
            <header className="flex items-center justify-between px-6 py-4">
                <button onClick={() => navigate("/")} className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
                    <Shield className="w-5 h-5 text-primary" />
                    <span className="font-semibold text-sm">SecureBank</span>
                </button>
                <ThemeToggle />
            </header>

            <div className="flex-1 flex items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-secondary/10 border border-secondary/20 mb-6"
                        >
                            <UserPlus className="w-8 h-8 text-secondary" />
                        </motion.div>
                        <h1 className="text-3xl font-bold tracking-tight text-gradient-primary">Create Account</h1>
                        <p className="text-muted-foreground text-sm mt-2 max-w-xs mx-auto">
                            New accounts are granted <span className="text-secondary font-semibold">Auditor</span> access by default.
                        </p>
                    </div>

                    <div className="glass rounded-xl p-6 space-y-5">
                        {success ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center gap-3 py-6 text-center"
                            >
                                <CheckCircle className="w-12 h-12 text-emerald-400" />
                                <p className="font-semibold text-foreground">Account created!</p>
                                <p className="text-sm text-muted-foreground">Redirecting to login…</p>
                            </motion.div>
                        ) : (
                            <>
                                {displayError && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm"
                                    >
                                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                        {displayError}
                                    </motion.div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {/* Username */}
                                    <div>
                                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Username</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <input
                                                type="text"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-input border border-border text-foreground text-sm placeholder:text-muted-foreground/50 input-glow focus:outline-none focus:border-primary/50 transition-colors"
                                                placeholder="Choose a username"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Password */}
                                    <div>
                                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <input
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-input border border-border text-foreground text-sm placeholder:text-muted-foreground/50 input-glow focus:outline-none focus:border-primary/50 transition-colors"
                                                placeholder="Min 6 characters"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Confirm Password */}
                                    <div>
                                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Confirm Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <input
                                                type="password"
                                                value={confirm}
                                                onChange={(e) => setConfirm(e.target.value)}
                                                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-input border border-border text-foreground text-sm placeholder:text-muted-foreground/50 input-glow focus:outline-none focus:border-primary/50 transition-colors"
                                                placeholder="Repeat password"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading || !username || !password || !confirm}
                                        className="w-full py-2.5 rounded-lg bg-secondary text-secondary-foreground font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:opacity-90"
                                    >
                                        {isLoading ? (
                                            <span className="inline-flex items-center gap-2">
                                                <span className="w-4 h-4 border-2 border-secondary-foreground/30 border-t-secondary-foreground rounded-full animate-spin" />
                                                Creating account…
                                            </span>
                                        ) : (
                                            "Create Account"
                                        )}
                                    </button>
                                </form>

                                <p className="text-xs text-center text-muted-foreground">
                                    Already have an account?{" "}
                                    <button
                                        onClick={() => navigate("/login")}
                                        className="text-primary hover:underline font-medium"
                                    >
                                        Sign in
                                    </button>
                                </p>
                            </>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default RegisterView;
