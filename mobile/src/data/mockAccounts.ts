import { Provider } from "@/types";

export const PROVIDERS: Provider[] = [
  { id: "esewa", name: "eSewa", shortName: "eSewa", category: "wallet", color: "#3B7D2B", availability: "sandbox", description: "Nepal's most used digital wallet." },
  { id: "khalti", name: "Khalti", shortName: "Khalti", category: "wallet", color: "#5C2D91", availability: "sandbox", description: "Digital wallet and payment gateway." },
  { id: "nabil", name: "Nabil Bank", shortName: "Nabil", category: "bank", color: "#B22222", availability: "demo", description: "Leading commercial bank in Nepal." },
  { id: "nicasia", name: "NIC Asia Bank", shortName: "NIC Asia", category: "bank", color: "#004B87", availability: "demo", description: "Commercial bank partner." },
  { id: "gibl", name: "Global IME Bank", shortName: "Global IME", category: "bank", color: "#D4600A", availability: "demo", description: "Full-service commercial bank." },
  { id: "kumari", name: "Kumari Bank", shortName: "Kumari", category: "bank", color: "#8E1B3C", availability: "available", description: "Commercial bank partner." },
  { id: "standardchartered", name: "Standard Chartered", shortName: "SCB", category: "bank", color: "#006A9C", availability: "available", description: "International commercial bank." },
  { id: "nmb", name: "NMB Bank", shortName: "NMB", category: "bank", color: "#0E6E4E", availability: "coming_soon", description: "Commercial bank partner." },
  { id: "himalayan", name: "Himalayan Bank", shortName: "Himalayan", category: "bank", color: "#8B1A1A", availability: "coming_soon", description: "Commercial bank partner." },
  { id: "nepalbank", name: "Nepal Bank", shortName: "Nepal Bank", category: "bank", color: "#6B4226", availability: "coming_soon", description: "Nepal's oldest bank." },
  { id: "siddhartha", name: "Siddhartha Bank", shortName: "Siddhartha", category: "bank", color: "#E5A813", availability: "coming_soon", description: "Commercial bank partner." },
  { id: "rastriyabanijya", name: "Rastriya Banijya Bank", shortName: "RBB", category: "bank", color: "#C7B005", availability: "coming_soon", description: "Government-owned commercial bank." },
  { id: "connectips", name: "connectIPS", shortName: "cIPS", category: "payment", color: "#0066A4", availability: "partner", description: "Interbank payment network." },
  { id: "fonepay", name: "Fonepay / QR", shortName: "Fonepay", category: "payment", color: "#D4600A", availability: "partner", description: "QR-based payment network." },
  { id: "stripe", name: "Stripe", shortName: "Stripe", category: "business", color: "#635BFF", availability: "demo", description: "For businesses receiving online/international payments." },
  { id: "tally", name: "Tally Prime", shortName: "Tally", category: "accounting", color: "#0B3D2E", availability: "demo", description: "Accounting workflow integration." },
  { id: "cash", name: "Cash", shortName: "Cash", category: "cash", color: "#0B3D2E", availability: "available", description: "Track cash income and expenses manually." },
];

/** Providers surfaced on the Connect Accounts onboarding step (spec order). */
export const ONBOARDING_PROVIDER_IDS = ["esewa", "khalti", "nabil", "nicasia", "gibl", "kumari", "tally"] as const;

/** Providers surfaced on the More > Bank/Wallet Connections screen (spec order). */
export const BANK_CONNECTION_PROVIDER_IDS = ["nabil", "nicasia", "gibl", "kumari", "standardchartered", "esewa", "khalti"] as const;

/** Pre-seeded default connections so the prototype feels alive on first run. */
export const DEFAULT_CONNECTED_PROVIDER_IDS = ["nabil", "nicasia", "gibl", "tally"] as const;
