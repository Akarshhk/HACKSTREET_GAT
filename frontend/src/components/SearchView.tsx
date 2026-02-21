import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { search as apiSearch, type SearchResult } from "@/lib/api";
import RoleBadge from "@/components/RoleBadge";
import ResultsTable from "@/components/ResultsTable";
import HowItWorks from "@/components/HowItWorks";
import ThemeToggle from "@/components/ThemeToggle";
import { Search, LogOut, Shield, AlertCircle } from "lucide-react";

const SearchView = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user) {
    navigate("/login");
    return null;
  }

  // Admins have their own dedicated page
  if (user.role === "admin") {
    navigate("/admin");
    return null;
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    try {
      const res = await apiSearch(query.trim(), user);
      setResults(res);
    } catch (err: any) {
      setError(err.message || "Search failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  /** --- Custom Bubble Cursor Effect --- */
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const bubble = document.createElement("div");
      bubble.className = "cursor-bubble";

      // Randomize between primary and secondary glow
      const hue = Math.random() > 0.5 ? 187 : 265;
      bubble.style.background = `hsla(${hue}, 100%, 38%, 0.4)`;
      bubble.style.boxShadow = `0 0 10px hsla(${hue}, 100%, 38%, 0.6), 0 0 20px hsla(${hue}, 100%, 38%, 0.2)`;

      bubble.style.left = `${e.clientX}px`;
      bubble.style.top = `${e.clientY}px`;

      document.body.appendChild(bubble);

      setTimeout(() => {
        bubble.remove();
      }, 800); // matches CSS animation duration
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen flex flex-col"
    >
      <header className="glass-strong border-b border-border/50 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Shield className="w-5 h-5 text-primary" />
            <span className="font-semibold text-sm tracking-tight">SecureBank</span>
          </div>
          <RoleBadge role={user.role} />
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-10">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gradient-primary">
            Encrypted Customer Search
          </h1>
          <p className="text-muted-foreground text-sm mt-2 max-w-lg">
            Search customer identifiers without exposing plaintext to the database.
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSearch}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 flex gap-3"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or account number..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-input border border-border text-foreground text-sm placeholder:text-muted-foreground/50 input-glow focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm btn-glow disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2 transition-all"
          >
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">Search</span>
          </button>
        </motion.form>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm mt-4"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </motion.div>
        )}

        <ResultsTable
          results={results}
          role={user.role}
          isLoading={isLoading}
          hasSearched={hasSearched}
        />

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <HowItWorks />
        </motion.div>
      </main>
    </motion.div>
  );
};

export default SearchView;