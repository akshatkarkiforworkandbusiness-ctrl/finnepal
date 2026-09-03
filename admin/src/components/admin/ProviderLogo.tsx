import { Landmark, QrCode, Banknote, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

function squash(s: string): string {
  return s.toLowerCase().replace(/[^a-z]/g, "");
}

// Real brand assets where we have them; a clean generic icon otherwise —
// never a fabricated logo. Keyed by a squashed (lowercase, no separators)
// form so both a provider `code` ("bank_demo") and a display name
// ("Bank Demo") resolve the same way.
const LOGO_BY_KEY: Record<string, string> = {
  esewa: "/logos/esewa.png",
  khalti: "/logos/khalti.png",
  nabil: "/logos/nabil.png",
  nabilbank: "/logos/nabil.png",
  connectips: "/logos/connectips.png",
  cips: "/logos/connectips.png",
  stripe: "/logos/stripe.png",
  nicasia: "/logos/nicasia.png",
  nicasiabank: "/logos/nicasia.png",
  gibl: "/logos/gibl.png",
  globalime: "/logos/gibl.png",
  globalimebank: "/logos/gibl.png",
};

const ICON_BY_KEY: Record<string, LucideIcon> = {
  bankdemo: Landmark,
  bank: Landmark,
  fonepay: QrCode,
  cash: Banknote,
  kumari: Landmark,
  kumaribank: Landmark,
  standardchartered: Landmark,
  scb: Landmark,
};

interface ProviderLogoProps {
  /** Provider code (preferred, e.g. "esewa") or display name (e.g. "eSewa") — either resolves. */
  provider: string;
  size?: number;
  className?: string;
}

export function ProviderLogo({ provider, size = 20, className }: ProviderLogoProps) {
  const key = squash(provider);
  const logoSrc = LOGO_BY_KEY[key];
  if (logoSrc) {
    return (
      <img
        src={logoSrc}
        alt={provider}
        width={size}
        height={size}
        className={cn("shrink-0 rounded-sm object-contain", className)}
      />
    );
  }

  const Icon = ICON_BY_KEY[key] ?? Landmark;
  return (
    <span
      className={cn("flex shrink-0 items-center justify-center rounded-sm bg-muted text-muted-foreground", className)}
      style={{ width: size, height: size }}
    >
      <Icon size={size * 0.65} />
    </span>
  );
}

export function ProviderBadge({ provider, label }: { provider: string; label?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
      <ProviderLogo provider={provider} size={18} />
      {label ?? provider}
    </span>
  );
}
