import type { Role } from "@/lib/api";
import { Shield, Eye, Settings } from "lucide-react";

interface RoleBadgeProps {
  role: Role;
}

const ROLE_CONFIG: Record<Role, { label: string; icon: typeof Shield; colorClass: string }> = {
  teller: { label: "Bank Staff", icon: Shield, colorClass: "border-primary/40 text-primary glow-border" },
  auditor: { label: "Compliance", icon: Eye, colorClass: "border-secondary/40 text-secondary glow-secondary" },
  admin: { label: "Admin", icon: Settings, colorClass: "border-amber-400/40 text-amber-400" },
};

const RoleBadge = ({ role }: RoleBadgeProps) => {
  const config = ROLE_CONFIG[role] ?? ROLE_CONFIG.auditor;
  const Icon = config.icon;

  return (
    <div
      className={`
        inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-mono text-xs font-semibold tracking-widest uppercase
        glass border
        ${config.colorClass}
      `}
    >
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </div>
  );
};

export default RoleBadge;
