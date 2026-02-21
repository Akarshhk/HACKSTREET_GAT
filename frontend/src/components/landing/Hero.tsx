import Reveal from "@/components/motion/Reveal";
import GlassCard from "@/components/ui/GlassCard";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative mx-auto max-w-6xl px-6 pt-16 pb-10">
      <div className="flex flex-col gap-10">
        <Reveal>
          <div className="flex flex-col gap-4">
            <p className="text-sm tracking-widest text-white/60 dark:text-white/60">
              SECURED STRING MATCHING • SEARCHABLE ENCRYPTION
            </p>

            <h1 className="text-4xl md:text-6xl font-semibold leading-tight">
              SecureBank Search
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-300 to-violet-300">
                encrypted lookup for banking data
              </span>
            </h1>

            <p className="max-w-2xl text-base md:text-lg text-black/70 dark:text-white/70">
              Search customer identifiers without exposing plaintext to the database.
              Role-based visibility ensures only authorized users can view sensitive records.
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                to="/login"
                className="
                  px-5 py-3 rounded-xl
                  bg-gradient-to-r from-cyan-400 to-violet-400
                  text-black font-medium
                  shadow-[0_0_20px_rgba(0,255,255,0.22)]
                  transition-all duration-300 ease-out
                  hover:-translate-y-0.5 hover:shadow-[0_0_45px_rgba(0,255,255,0.35)]
                  active:translate-y-0
                "
              >
                Access Demo →
              </Link>

              <a
                href="#how"
                className="
                  px-5 py-3 rounded-xl
                  border border-black/10 dark:border-white/10
                  bg-white/50 dark:bg-white/5 backdrop-blur-xl
                  transition-all duration-300 ease-out
                  hover:-translate-y-0.5 hover:bg-white/70 dark:hover:bg-white/10
                  hover:shadow-[0_0_35px_rgba(160,70,255,0.20)]
                  active:translate-y-0
                "
              >
                How it works
              </a>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="grid md:grid-cols-3 gap-4">
            <GlassCard className="p-5 group cursor-pointer ring-1 ring-transparent hover:ring-cyan-300/20">
              <p className="text-sm text-black/60 dark:text-white/60">Database</p>
              <p className="mt-2 text-lg font-semibold transition-colors duration-300 group-hover:text-cyan-200">
                Sees only ciphertext
              </p>
              <p className="mt-2 text-sm text-black/60 dark:text-white/60 transition-opacity duration-300 group-hover:opacity-90">
                No plaintext names, account numbers, or tokens stored.
              </p>
            </GlassCard>

            <GlassCard className="p-5 group cursor-pointer ring-1 ring-transparent hover:ring-cyan-300/20">
              <p className="text-sm text-black/60 dark:text-white/60">Search</p>
              <p className="mt-2 text-lg font-semibold transition-colors duration-300 group-hover:text-cyan-200">
                Works while encrypted
              </p>
              <p className="mt-2 text-sm text-black/60 dark:text-white/60 transition-opacity duration-300 group-hover:opacity-90">
                Secure index enables matching without decrypting the entire DB.
              </p>
            </GlassCard>

            <GlassCard className="p-5 group cursor-pointer ring-1 ring-transparent hover:ring-cyan-300/20">
              <p className="text-sm text-black/60 dark:text-white/60">Access</p>
              <p className="mt-2 text-lg font-semibold transition-colors duration-300 group-hover:text-cyan-200">
                Role-based visibility
              </p>
              <p className="mt-2 text-sm text-black/60 dark:text-white/60 transition-opacity duration-300 group-hover:opacity-90">
                Authorized users see full results; others see masked metadata.
              </p>
            </GlassCard>
          </div>
        </Reveal>
      </div>
    </section>
  );
}