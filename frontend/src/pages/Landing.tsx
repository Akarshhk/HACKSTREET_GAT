import Hero from "@/components/landing/Hero";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Lock, Search, Database, Key, AlertTriangle, Eye, Zap, ArrowRight } from "lucide-react";
import GridBackground from "@/components/GridBackground";
import ThemeToggle from "@/components/ThemeToggle";

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    { icon: Lock, title: "Encrypted Data at Rest", desc: "Customer PII is stored encrypted — never as plaintext in the database." },
    { icon: Search, title: "Secure Searchable Index", desc: "Search tokens enable matching without exposing raw data to the DB engine." },
    { icon: Eye, title: "Role-Based Visibility", desc: "Bank Staff see full records; Compliance Viewers see only masked results." },
    { icon: Zap, title: "Practical Real-Time Search", desc: "Sub-second encrypted lookups suitable for production banking workflows." },
  ];

  const steps = [
    { num: "01", title: "User submits query (over TLS)", desc: "The search term is securely transmitted to the backend." },
    { num: "02", title: "Backend generates secure search token / query mask", desc: "Server-side encryption creates a trapdoor token for matching." },
    { num: "03", title: "DB matches encrypted index; backend reveals only what the role is allowed to see", desc: "Encrypted index is searched; RBAC controls decryption of results." },
  ];

  return (
    <div className="relative min-h-screen">
      <GridBackground />
      <div className="relative z-10">
        {/* Nav */}
        <header className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <span className="font-semibold text-sm tracking-tight text-foreground">SecureBank</span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              Login
            </button>
          </div>
        </header>

        {/* Hero */}
         
    <div className="relative">
      <div className="noise" />
      <Hero />

      <section id="how" className="mx-auto max-w-6xl px-6 pb-16">
        {/* later: add HowItWorks cards here using Reveal + GlassCard */}
      </section>
    </div>
  

        <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-mono text-muted-foreground mb-6">
              <Lock className="w-3 h-3 text-primary" />
              Searchable Encryption Demo
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gradient-primary leading-tight">
              SecureBank Search
            </h1>
            <p className="text-muted-foreground text-lg mt-4 max-w-2xl mx-auto">
              Encrypted string matching for banking customer lookup. Search without ever exposing plaintext to the database.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
              <button
                onClick={() => navigate("/login")}
                className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm btn-glow flex items-center gap-2 transition-all"
              >
                Access Demo
                <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href="#how-it-works"
                className="px-6 py-3 rounded-lg border border-border text-foreground font-medium text-sm hover:bg-muted transition-colors"
              >
                How It Works
              </a>
            </div>
          </motion.div>
        </section>

        {/* Problem / Solution */}
        <section className="max-w-5xl mx-auto px-6 pb-16">
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="glass rounded-xl p-6"
            >
              <div className="w-10 h-10 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center justify-center mb-4">
                <AlertTriangle className="w-5 h-5 text-destructive" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">The Problem</h3>
              <p className="text-muted-foreground text-sm">
                Banks must encrypt customer data, but encrypted data breaks search. Traditional encryption makes lookups impossible without full decryption.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="glass rounded-xl p-6"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                <Key className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">The Solution</h3>
              <p className="text-muted-foreground text-sm">
                Searchable encryption enables secure search without exposing plaintext to the database. The DB matches encrypted indices while keys never leave the backend.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Features */}
        <section className="max-w-5xl mx-auto px-6 pb-16">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-2xl font-bold text-foreground text-center mb-10"
          >
            Key Features
          </motion.h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-xl p-5 hover:glow-border transition-all duration-300"
              >
                <f.icon className="w-5 h-5 text-primary mb-3" />
                <h4 className="text-sm font-semibold text-foreground mb-1">{f.title}</h4>
                <p className="text-xs text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="max-w-4xl mx-auto px-6 pb-16">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-2xl font-bold text-foreground text-center mb-10"
          >
            How It Works
          </motion.h2>
          <div className="space-y-6">
            {steps.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="glass rounded-xl p-6 flex items-start gap-5"
              >
                <span className="text-2xl font-bold text-primary/30 font-mono flex-shrink-0">{s.num}</span>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">{s.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Security Notes */}
        <section className="max-w-4xl mx-auto px-6 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-xl p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-4 h-4 text-muted-foreground" />
              <h4 className="text-sm font-semibold text-foreground">Security Notes</h4>
            </div>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                Does not protect against malicious authorized users
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                Access-pattern leakage is a known limitation
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                Keys never leave the backend
              </li>
            </ul>
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default Landing;
