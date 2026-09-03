import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Home, Link2, BarChart3, Shield, Bell,
  ChevronRight, Eye, EyeOff, Plus,
  ArrowUpRight, ArrowDownLeft, CheckCircle2,
  AlertTriangle, Info, TrendingUp, Award,
  QrCode, Share2, Download, Zap, RefreshCw,
  X, Check, Search, MapPin, Lock
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";

// ─── Types ──────────────────────────────────────────────────────────────────

type AppPhase = "onboarding" | "main";
type OnboardingStep = "splash" | "welcome" | "pin";
type MainTab = "home" | "connect" | "insights" | "passport" | "security";

interface Provider {
  id: string;
  name: string;
  shortName: string;
  type: "bank" | "wallet" | "payment" | "cash";
  color: string;
  balance?: number;
  connected: boolean;
  lastSync?: string;
  accountNo?: string;
}

interface Transaction {
  id: number;
  type: "income" | "expense";
  description: string;
  amount: number;
  provider: string;
  providerColor: string;
  time: string;
  category: string;
}

interface AlertItem {
  id: number;
  type: "info" | "warning" | "success";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

// ─── Mock Data ──────────────────────────────────────────────────────────────

const PROVIDERS: Provider[] = [
  { id: "esewa", name: "eSewa", shortName: "eSewa", type: "wallet", color: "#3B7D2B", balance: 45200, connected: true, lastSync: "2 min ago", accountNo: "97••4521" },
  { id: "khalti", name: "Khalti", shortName: "Khalti", type: "wallet", color: "#5C2D91", balance: 18750, connected: true, lastSync: "5 min ago", accountNo: "98••8832" },
  { id: "nabil", name: "Nabil Bank", shortName: "Nabil", type: "bank", color: "#B22222", balance: 175000, connected: true, lastSync: "1 hr ago", accountNo: "••4523" },
  { id: "cash", name: "Cash", shortName: "Cash", type: "cash", color: "#0B3D2E", balance: 6850, connected: true, lastSync: "Manual" },
  { id: "nic-asia", name: "NIC Asia Bank", shortName: "NIC Asia", type: "bank", color: "#004B87", connected: false },
  { id: "prabhu", name: "Prabhu Pay", shortName: "Prabhu", type: "wallet", color: "#005FA3", connected: false },
  { id: "ime", name: "IME Pay", shortName: "IME", type: "wallet", color: "#D4600A", connected: false },
  { id: "connectips", name: "ConnectIPS", shortName: "cIPS", type: "payment", color: "#0066A4", connected: false },
  { id: "global-ime", name: "Global IME Bank", shortName: "GIBL", type: "bank", color: "#1B5E20", connected: false },
  { id: "citizens", name: "Citizens Bank", shortName: "CBL", type: "bank", color: "#8B1A1A", connected: false },
];

const TRANSACTIONS: Transaction[] = [
  { id: 1, type: "income", description: "Handicraft Sale – Thamel", amount: 15000, provider: "eSewa", providerColor: "#3B7D2B", time: "Today, 10:30 AM", category: "Business" },
  { id: 2, type: "expense", description: "Kalimati Market – Vegetables", amount: 2350, provider: "Khalti", providerColor: "#5C2D91", time: "Today, 8:15 AM", category: "Food" },
  { id: 3, type: "expense", description: "Nepal Electricity Authority", amount: 1850, provider: "Nabil Bank", providerColor: "#B22222", time: "Yesterday, 3:00 PM", category: "Utilities" },
  { id: 4, type: "income", description: "SKBBL Micro-loan Disbursement", amount: 50000, provider: "Nabil Bank", providerColor: "#B22222", time: "Yesterday, 1:00 PM", category: "Finance" },
  { id: 5, type: "expense", description: "Loan Repayment – SKBBL", amount: 5000, provider: "Nabil Bank", providerColor: "#B22222", time: "2 days ago", category: "Finance" },
  { id: 6, type: "expense", description: "Microbus – Ratnapark to Patan", amount: 300, provider: "Cash", providerColor: "#0B3D2E", time: "2 days ago", category: "Transport" },
];

const MONTHLY_DATA = [
  { month: "Feb", income: 45000, expenses: 32000 },
  { month: "Mar", income: 48000, expenses: 35000 },
  { month: "Apr", income: 52000, expenses: 38000 },
  { month: "May", income: 49000, expenses: 41000 },
  { month: "Jun", income: 55000, expenses: 36000 },
  { month: "Jul", income: 52000, expenses: 38500 },
];

const CATEGORIES = [
  { name: "Business", amount: 12500, color: "#0B3D2E" },
  { name: "Food & Market", amount: 8200, color: "#2D7A5A" },
  { name: "Finance & Loans", amount: 7100, color: "#C5161D" },
  { name: "Utilities", amount: 5800, color: "#4A9B7A" },
  { name: "Transport", amount: 2700, color: "#6BB89A" },
  { name: "Other", amount: 2200, color: "#BDC9C4" },
];

const ALERT_DATA: AlertItem[] = [
  { id: 1, type: "warning", title: "Unusual Activity Detected", message: "3 eSewa transactions within 5 minutes. Tap to review and confirm.", time: "2 hrs ago", read: false },
  { id: 2, type: "info", title: "Financial Passport Accessed", message: "Your Passport was viewed by a Nabil Bank loan officer.", time: "1 day ago", read: false },
  { id: 3, type: "success", title: "Nabil Bank Synced", message: "Account data updated successfully with 3 new transactions.", time: "2 days ago", read: true },
  { id: 4, type: "info", title: "New Device Login", message: "Login detected from Samsung Galaxy S23 in Kathmandu.", time: "3 days ago", read: true },
  { id: 5, type: "success", title: "Khalti Connected", message: "Khalti wallet successfully linked to your ORBIT account.", time: "1 week ago", read: true },
];

const HEALTH_COMPONENTS = [
  { label: "Income Regularity", score: 82, description: "Consistent monthly earnings from business and sales" },
  { label: "Savings Behaviour", score: 68, description: "Saving ~26% of monthly income — above Nepal average" },
  { label: "Payment History", score: 91, description: "All loan repayments on time with no defaults" },
  { label: "Business Activity", score: 58, description: "Active sales volume, growing month-on-month" },
];

const WELCOME_SLIDES = [
  {
    illustration: (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {[0,1,2,3,4].map(i => (
          <circle key={i} cx={20 + i * 22} cy={60} r={10} fill={i % 2 === 0 ? "#0B3D2E" : "#E8F0EB"} opacity={0.7 + i * 0.06} />
        ))}
        {[0,1,2,3].map(i => (
          <line key={i} x1={30 + i * 22} y1={60} x2={42 + i * 22} y2={60} stroke="#BDD8C6" strokeWidth={2} strokeDasharray="3 2" />
        ))}
        <circle cx={60} cy={60} r={18} fill="#0B3D2E" />
        <text x={60} y={65} textAnchor="middle" fill="white" fontSize={14} fontWeight="bold">₨</text>
      </svg>
    ),
    title: "Your money is everywhere.",
    subtitle: "Banks, wallets, cash, loans — scattered across Nepal's fragmented financial landscape.",
    accent: "Your financial identity should be in one place.",
  },
  {
    illustration: (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect x={10} y={30} width={100} height={60} rx={12} fill="#E8F0EB" />
        <rect x={20} y={42} width={35} height={8} rx={4} fill="#0B3D2E" opacity={0.7} />
        <rect x={20} y={56} width={50} height={6} rx={3} fill="#BDD8C6" />
        <rect x={20} y={68} width={40} height={6} rx={3} fill="#BDD8C6" />
        <circle cx={88} cy={62} r={16} fill="#0B3D2E" />
        <text x={88} y={67} textAnchor="middle" fill="white" fontSize={18} fontWeight="bold">74</text>
      </svg>
    ),
    title: "See the full picture.",
    subtitle: "Connect eSewa, Khalti, bank accounts, and cash in one unified view of your true financial health.",
    accent: "One dashboard. All your money. Total clarity.",
  },
  {
    illustration: (
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect x={20} y={15} width={80} height={90} rx={10} fill="#0B3D2E" />
        <rect x={28} y={25} width={30} height={36} rx={6} fill="rgba(255,255,255,0.15)" />
        <text x={43} y={49} textAnchor="middle" fill="white" fontSize={18} fontWeight="bold">SS</text>
        <rect x={64} y={30} width={28} height={6} rx={3} fill="rgba(255,255,255,0.5)" />
        <rect x={64} y={42} width={20} height={5} rx={2.5} fill="rgba(255,255,255,0.3)" />
        <rect x={28} y={70} width={64} height={6} rx={3} fill="rgba(255,255,255,0.2)" />
        <rect x={28} y={82} width={48} height={5} rx={2.5} fill="rgba(255,255,255,0.15)" />
        <circle cx={90} cy={25} r={10} fill="#C5161D" />
        <text x={90} y={30} textAnchor="middle" fill="white" fontSize={14} fontWeight="bold">✓</text>
      </svg>
    ),
    title: "Build your Financial Passport.",
    subtitle: "Turn your transaction history into a verified financial identity — accepted by banks, lenders, and insurers.",
    accent: "Your history. Your proof. Your future.",
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function ScoreGauge({ score, size = 120 }: { score: number; size?: number }) {
  const sw = 13;
  const r = (size - sw * 2) / 2;
  const circ = 2 * Math.PI * r;
  const cx = size / 2;
  const cy = size / 2;
  const arcFraction = 0.75;
  const trackLen = circ * arcFraction;
  const progressLen = (score / 100) * trackLen;

  return (
    <svg width={size} height={size * 0.82} viewBox={`0 0 ${size} ${size}`} style={{ overflow: "visible" }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#E8F0EB" strokeWidth={sw}
        strokeDasharray={`${trackLen} ${circ}`} strokeLinecap="round"
        transform={`rotate(135 ${cx} ${cy})`} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#0B3D2E" strokeWidth={sw}
        strokeDasharray={`${progressLen} ${circ}`} strokeLinecap="round"
        transform={`rotate(135 ${cx} ${cy})`} />
      <text x={cx} y={cy + 6} textAnchor="middle" fill="#0B3D2E" fontSize={size * 0.22} fontWeight="700"
        fontFamily="Plus Jakarta Sans, sans-serif">{score}</text>
    </svg>
  );
}

function ScoreBar({ score, color = "#0B3D2E" }: { score: number; color?: string }) {
  return (
    <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "#E0EBE5" }}>
      <div className="h-full rounded-full" style={{ width: `${score}%`, backgroundColor: color, transition: "width 0.6s ease" }} />
    </div>
  );
}

function ProviderBadge({ provider, size = 40 }: { provider: Provider; size?: number }) {
  return (
    <div className="rounded-xl flex items-center justify-center font-bold text-white flex-shrink-0"
      style={{ width: size, height: size, backgroundColor: provider.color, fontSize: Math.round(size * 0.38) }}>
      {provider.shortName.charAt(0)}
    </div>
  );
}

// ─── Onboarding ───────────────────────────────────────────────────────────────

function SplashScreen({ onNext }: { onNext: () => void }) {
  useEffect(() => {
    const t = setTimeout(onNext, 2600);
    return () => clearTimeout(t);
  }, [onNext]);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ backgroundColor: "#071F17" }}>
      {/* Radial glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="rounded-full" style={{ width: 280, height: 280, background: "radial-gradient(circle, rgba(11,61,46,0.7) 0%, transparent 70%)" }} />
      </div>

      <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
        className="flex flex-col items-center relative">

        {/* Logo mark */}
        <div className="relative mb-8">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border-2"
            style={{ borderColor: "rgba(255,255,255,0.1)", width: 88, height: 88, top: -4, left: -4 }} />
          <div className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{ border: "2px solid rgba(255,255,255,0.15)", backgroundColor: "rgba(255,255,255,0.05)" }}>
            <div className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ border: "2px solid rgba(255,255,255,0.3)", backgroundColor: "rgba(255,255,255,0.05)" }}>
              <div className="w-4 h-4 rounded-full bg-white" style={{ boxShadow: "0 0 12px rgba(255,255,255,0.8)" }} />
            </div>
          </div>
          {/* Orbiting dot */}
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute" style={{ width: 88, height: 88, top: -4, left: -4 }}>
            <div className="absolute w-3 h-3 rounded-full" style={{ backgroundColor: "#C5161D", top: "50%", right: -4, transform: "translateY(-50%)", boxShadow: "0 0 8px #C5161D" }} />
          </motion.div>
        </div>

        <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-white font-bold mb-2"
          style={{ fontSize: 44, letterSpacing: "0.22em", fontFamily: "Plus Jakarta Sans, sans-serif" }}>
          ORBIT
        </motion.h1>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
          className="text-xs uppercase tracking-widest"
          style={{ color: "rgba(255,255,255,0.4)", letterSpacing: "0.28em" }}>
          Connect · Understand · Grow
        </motion.p>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.35 }} transition={{ delay: 1.4 }}
        className="absolute bottom-12 flex flex-col items-center gap-1">
        <p className="text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>Nepal Financial Inclusion Platform</p>
      </motion.div>
    </div>
  );
}

function WelcomeScreen({ onNext }: { onNext: () => void }) {
  const [slide, setSlide] = useState(0);

  const go = () => {
    if (slide < WELCOME_SLIDES.length - 1) setSlide(slide + 1);
    else onNext();
  };

  const s = WELCOME_SLIDES[slide];

  return (
    <div className="absolute inset-0 flex flex-col" style={{ backgroundColor: "#F5F3EF" }}>
      <div className="flex justify-end px-6 pt-4">
        <button onClick={onNext} className="text-xs font-medium px-3 py-1.5 rounded-full"
          style={{ color: "#9CA3AF", backgroundColor: "rgba(0,0,0,0.05)" }}>Skip</button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        <AnimatePresence mode="wait">
          <motion.div key={slide} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}
            className="flex flex-col items-center w-full">
            <div className="w-36 h-36 rounded-3xl mb-8 flex items-center justify-center p-4"
              style={{ backgroundColor: "#E8F0EB" }}>
              {s.illustration}
            </div>
            <h2 className="text-2xl font-bold mb-4 leading-snug" style={{ color: "#0B3D2E" }}>{s.title}</h2>
            <p className="text-sm leading-relaxed mb-5" style={{ color: "#4B5563" }}>{s.subtitle}</p>
            <p className="text-sm font-semibold" style={{ color: "#C5161D" }}>{s.accent}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-center gap-2 mb-6">
        {WELCOME_SLIDES.map((_, i) => (
          <button key={i} onClick={() => setSlide(i)}
            className="rounded-full transition-all duration-300"
            style={{ width: i === slide ? 24 : 8, height: 8, backgroundColor: i === slide ? "#0B3D2E" : "#D1D5DB" }} />
        ))}
      </div>

      <div className="px-6 pb-10">
        <button onClick={go}
          className="w-full py-4 rounded-2xl text-white font-semibold text-base"
          style={{ backgroundColor: "#0B3D2E", boxShadow: "0 4px 16px rgba(11,61,46,0.35)" }}>
          {slide < WELCOME_SLIDES.length - 1 ? "Continue" : "Get Started"}
        </button>
      </div>
    </div>
  );
}

function PinScreen({ onNext }: { onNext: () => void }) {
  const [pin, setPin] = useState<number[]>([]);
  const [done, setDone] = useState(false);

  const addDigit = (d: number) => {
    if (pin.length >= 4) return;
    const next = [...pin, d];
    setPin(next);
    if (next.length === 4) {
      setDone(true);
      setTimeout(onNext, 700);
    }
  };

  const del = () => setPin(pin.slice(0, -1));

  const keys = [1,2,3,4,5,6,7,8,9,null,0,"del"] as const;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center px-6" style={{ backgroundColor: "#F5F3EF" }}>
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
        style={{ backgroundColor: "#0B3D2E", boxShadow: "0 4px 16px rgba(11,61,46,0.35)" }}>
        <div className="w-6 h-6 rounded-full flex items-center justify-center"
          style={{ border: "2px solid rgba(255,255,255,0.6)" }}>
          <div className="w-2 h-2 rounded-full bg-white" />
        </div>
      </div>

      <h2 className="text-xl font-bold mb-1.5" style={{ color: "#0B3D2E" }}>Welcome back, Sunita</h2>
      <p className="text-sm mb-8" style={{ color: "#9CA3AF" }}>Enter your 4-digit PIN</p>

      {/* PIN dots */}
      <div className="flex gap-5 mb-10">
        {[0,1,2,3].map(i => (
          <motion.div key={i} animate={{ scale: pin.length > i ? 1.2 : 1 }}
            className="w-4 h-4 rounded-full border-2 transition-colors duration-200"
            style={{
              backgroundColor: pin.length > i ? (done ? "#16A34A" : "#0B3D2E") : "transparent",
              borderColor: pin.length > i ? (done ? "#16A34A" : "#0B3D2E") : "#D1D5DB",
            }} />
        ))}
      </div>

      {/* Keypad */}
      <div className="grid grid-cols-3 gap-3 w-full max-w-[260px]">
        {keys.map((k, i) => {
          if (k === null) return <div key={i} />;
          if (k === "del") return (
            <button key={i} onClick={del}
              className="h-16 rounded-2xl flex items-center justify-center text-xl font-medium active:opacity-60"
              style={{ backgroundColor: "#E8F0EB", color: "#0B3D2E" }}>⌫</button>
          );
          return (
            <button key={i} onClick={() => addDigit(k as number)}
              className="h-16 rounded-2xl flex items-center justify-center text-xl font-semibold active:opacity-70"
              style={{ backgroundColor: "#FFFFFF", color: "#0B3D2E", border: "1px solid rgba(11,61,46,0.1)", boxShadow: "0 1px 4px rgba(11,61,46,0.06)" }}>
              {k}
            </button>
          );
        })}
      </div>

      <button className="mt-8 text-sm font-medium" style={{ color: "#C5161D" }}>
        Forgot PIN? Verify with phone number
      </button>
    </div>
  );
}

// ─── Home Screen ──────────────────────────────────────────────────────────────

function HomeScreen({ onNavigateTab }: { onNavigateTab: (t: MainTab) => void }) {
  const [visible, setVisible] = useState(true);
  const connected = PROVIDERS.filter(p => p.connected && p.balance !== undefined);
  const total = connected.reduce((s, p) => s + (p.balance || 0), 0);

  return (
    <div className="flex-1 overflow-y-auto" style={{ backgroundColor: "#F5F3EF", scrollbarWidth: "none" }}>

      {/* ── Header ── */}
      <div className="px-5 pt-4 pb-6" style={{ backgroundColor: "#0B3D2E" }}>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold"
              style={{ backgroundColor: "rgba(255,255,255,0.15)", border: "1.5px solid rgba(255,255,255,0.25)" }}>SS</div>
            <div>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>Namaste,</p>
              <p className="text-sm font-semibold text-white">Sunita Sharma</p>
            </div>
          </div>
          <button className="relative w-9 h-9 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "rgba(255,255,255,0.1)" }}>
            <Bell size={16} className="text-white" />
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: "#C5161D", fontSize: 9 }}>2</span>
          </button>
        </div>

        <div className="flex items-center gap-2 mb-1">
          <p className="text-xs uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.5)" }}>Total Net Worth</p>
          <button onClick={() => setVisible(!visible)}>
            {visible ? <Eye size={12} style={{ color: "rgba(255,255,255,0.4)" }} /> : <EyeOff size={12} style={{ color: "rgba(255,255,255,0.4)" }} />}
          </button>
        </div>
        <p className="text-white font-bold mb-1" style={{ fontSize: 36, letterSpacing: "-0.5px" }}>
          {visible ? `NPR ${total.toLocaleString("en-IN")}` : "NPR ••••••"}
        </p>
        <div className="flex items-center gap-1.5">
          <TrendingUp size={12} style={{ color: "#86efac" }} />
          <p className="text-xs font-medium" style={{ color: "#86efac" }}>+NPR 13,500 net this month</p>
        </div>

        {/* Quick stats */}
        <div className="flex gap-3 mt-4">
          {[
            { label: "Income", value: "52,000", up: true },
            { label: "Expenses", value: "38,500", up: false },
            { label: "Saved", value: "13,500", highlight: true },
          ].map(s => (
            <div key={s.label} className="flex-1 rounded-xl px-3 py-2.5"
              style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>
              <p className="text-xs mb-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>{s.label}</p>
              <p className="text-sm font-semibold" style={{ color: s.highlight ? "#86efac" : "white" }}>
                NPR {s.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Financial Health ── */}
      <div className="px-4 -mt-3 mb-4">
        <div className="rounded-2xl p-4 flex items-center gap-4"
          style={{ backgroundColor: "#FFFFFF", boxShadow: "0 2px 16px rgba(11,61,46,0.1)" }}>
          <ScoreGauge score={74} size={100} />
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "#9CA3AF" }}>Financial Health</p>
            <p className="font-bold mb-0.5" style={{ fontSize: 30, color: "#0B3D2E", lineHeight: 1 }}>
              74<span className="text-base font-normal" style={{ color: "#9CA3AF" }}>/100</span>
            </p>
            <p className="text-xs font-semibold mb-2" style={{ color: "#2D7A5A" }}>Good · Improving ↑4 pts</p>
            <button onClick={() => onNavigateTab("insights")}
              className="flex items-center gap-1 text-xs font-semibold" style={{ color: "#C5161D" }}>
              View breakdown <ChevronRight size={11} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <div className="px-4 mb-5">
        <div className="grid grid-cols-4 gap-3">
          {[
            { icon: Plus, label: "Add" },
            { icon: ArrowUpRight, label: "Pay" },
            { icon: ArrowDownLeft, label: "Request" },
            { icon: Zap, label: "Scan" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-1.5">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: "#E8F0EB" }}>
                <Icon size={21} style={{ color: "#0B3D2E" }} />
              </div>
              <p className="text-xs font-medium" style={{ color: "#4B5563" }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Connected Accounts ── */}
      <div className="mb-5">
        <div className="flex items-center justify-between px-4 mb-3">
          <p className="text-sm font-semibold" style={{ color: "#1A1A1A" }}>Connected Accounts</p>
          <button onClick={() => onNavigateTab("connect")}
            className="text-xs font-semibold flex items-center gap-0.5" style={{ color: "#C5161D" }}>
            Manage <ChevronRight size={11} />
          </button>
        </div>
        <div className="flex gap-3 px-4 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {connected.map(p => (
            <div key={p.id} className="flex-shrink-0 rounded-2xl p-3"
              style={{ minWidth: 136, backgroundColor: "#FFFFFF", border: "1px solid rgba(11,61,46,0.07)", boxShadow: "0 1px 8px rgba(11,61,46,0.06)" }}>
              <div className="flex items-center gap-2 mb-2">
                <ProviderBadge provider={p} size={28} />
                <div>
                  <p className="text-xs font-semibold" style={{ color: "#1A1A1A" }}>{p.shortName}</p>
                  <p className="text-xs capitalize" style={{ color: "#9CA3AF" }}>{p.type}</p>
                </div>
              </div>
              <p className="text-sm font-bold" style={{ color: "#0B3D2E" }}>
                {visible ? `NPR ${(p.balance || 0).toLocaleString("en-IN")}` : "••••••"}
              </p>
              <p className="text-xs mt-0.5" style={{ color: "#BDC9C4" }}>↺ {p.lastSync}</p>
            </div>
          ))}
          <button onClick={() => onNavigateTab("connect")}
            className="flex-shrink-0 rounded-2xl flex flex-col items-center justify-center gap-1"
            style={{ minWidth: 80, backgroundColor: "#E8F0EB", border: "2px dashed rgba(11,61,46,0.2)" }}>
            <Plus size={18} style={{ color: "#0B3D2E" }} />
            <p className="text-xs font-medium" style={{ color: "#0B3D2E" }}>Add</p>
          </button>
        </div>
      </div>

      {/* ── Passport Promo ── */}
      <div className="mx-4 mb-5">
        <button onClick={() => onNavigateTab("passport")} className="w-full rounded-2xl overflow-hidden text-left"
          style={{ background: "linear-gradient(135deg, #071F17 0%, #0B3D2E 60%, #1A5C42 100%)", boxShadow: "0 4px 20px rgba(7,31,23,0.4)" }}>
          <div className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider mb-1" style={{ color: "rgba(255,255,255,0.45)" }}>YOUR</p>
              <p className="text-white font-bold text-base mb-0.5">Financial Passport</p>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: "rgba(134,239,172,0.2)", color: "#86efac" }}>ACTIVE</span>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>Trust Score 78/100</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Award size={28} style={{ color: "rgba(255,255,255,0.25)" }} />
              <div className="flex items-center gap-1">
                <p className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.6)" }}>View passport</p>
                <ChevronRight size={12} style={{ color: "rgba(255,255,255,0.4)" }} />
              </div>
            </div>
          </div>
        </button>
      </div>

      {/* ── Recent Activity ── */}
      <div className="px-4 pb-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold" style={{ color: "#1A1A1A" }}>Recent Activity</p>
          <button className="text-xs font-semibold" style={{ color: "#C5161D" }}>See all</button>
        </div>
        <div className="flex flex-col gap-2">
          {TRANSACTIONS.slice(0, 5).map(tx => (
            <div key={tx.id} className="flex items-center gap-3 p-3 rounded-xl"
              style={{ backgroundColor: "#FFFFFF", border: "1px solid rgba(11,61,46,0.06)" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: tx.type === "income" ? "rgba(22,163,74,0.1)" : "rgba(197,22,29,0.08)" }}>
                {tx.type === "income"
                  ? <ArrowDownLeft size={17} style={{ color: "#16A34A" }} />
                  : <ArrowUpRight size={17} style={{ color: "#C5161D" }} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: "#1A1A1A" }}>{tx.description}</p>
                <p className="text-xs" style={{ color: "#9CA3AF" }}>{tx.provider} · {tx.time}</p>
              </div>
              <p className="text-sm font-bold flex-shrink-0"
                style={{ color: tx.type === "income" ? "#16A34A" : "#C5161D" }}>
                {tx.type === "income" ? "+" : "−"}NPR {tx.amount.toLocaleString("en-IN")}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Connect Screen ───────────────────────────────────────────────────────────

function ConnectScreen() {
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<Provider | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [success, setSuccess] = useState(false);

  const connectedList = PROVIDERS.filter(p => p.connected);
  const available = PROVIDERS.filter(p => !p.connected &&
    (p.name.toLowerCase().includes(search.toLowerCase()) || p.type.toLowerCase().includes(search.toLowerCase())));

  const openModal = (p: Provider) => { setModal(p); setConnecting(false); setSuccess(false); };

  const doConnect = () => {
    setConnecting(true);
    setTimeout(() => { setConnecting(false); setSuccess(true); }, 2200);
  };

  return (
    <div className="flex-1 overflow-y-auto" style={{ backgroundColor: "#F5F3EF", scrollbarWidth: "none" }}>
      <div className="px-5 pt-4 pb-5" style={{ backgroundColor: "#0B3D2E" }}>
        <h1 className="text-white font-bold text-xl mb-0.5">My Connections</h1>
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>You control what ORBIT can see</p>
      </div>

      {/* Connected */}
      <div className="px-4 pt-4 mb-4">
        <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#9CA3AF" }}>
          Connected ({connectedList.length})
        </p>
        <div className="flex flex-col gap-2">
          {connectedList.map(p => (
            <div key={p.id} className="flex items-center gap-3 p-4 rounded-2xl"
              style={{ backgroundColor: "#FFFFFF", border: "1px solid rgba(11,61,46,0.07)", boxShadow: "0 1px 8px rgba(11,61,46,0.06)" }}>
              <ProviderBadge provider={p} size={44} />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-semibold text-sm" style={{ color: "#1A1A1A" }}>{p.name}</p>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ backgroundColor: "#E8F0EB", color: "#0B3D2E" }}>Live</span>
                </div>
                <p className="text-xs mb-0.5" style={{ color: "#9CA3AF" }}>
                  {p.type === "wallet" ? "Digital Wallet" : p.type === "bank" ? "Bank Account" : p.type === "cash" ? "Cash" : "Payment"} · Synced {p.lastSync}
                </p>
                {p.accountNo && <p className="text-xs font-medium" style={{ color: "#6B7280" }}>Account {p.accountNo}</p>}
              </div>
              <div className="flex flex-col items-end gap-2">
                <CheckCircle2 size={16} style={{ color: "#16A34A" }} />
                <button className="text-xs font-medium" style={{ color: "#C5161D" }}>Revoke</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Consent notice */}
      <div className="mx-4 mb-5 p-3 rounded-xl flex gap-2.5"
        style={{ backgroundColor: "#E8F0EB", border: "1px solid rgba(11,61,46,0.12)" }}>
        <Lock size={13} style={{ color: "#0B3D2E", flexShrink: 0, marginTop: 2 }} />
        <p className="text-xs leading-relaxed" style={{ color: "#2D5A3D" }}>
          ORBIT uses <strong>read-only</strong> access. We never move your money or share your data without consent. Revoke any connection instantly.
        </p>
      </div>

      {/* Add */}
      <div className="px-4 mb-4">
        <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#9CA3AF" }}>Add Provider</p>
        <div className="flex items-center gap-2 px-3 mb-3 rounded-xl"
          style={{ backgroundColor: "#FFFFFF", border: "1px solid rgba(11,61,46,0.1)" }}>
          <Search size={14} style={{ color: "#9CA3AF" }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search banks, wallets..."
            className="flex-1 py-3 text-sm bg-transparent outline-none"
            style={{ color: "#1A1A1A" }} />
          {search && <button onClick={() => setSearch("")}><X size={13} style={{ color: "#9CA3AF" }} /></button>}
        </div>
        <div className="grid grid-cols-2 gap-2">
          {available.map(p => (
            <button key={p.id} onClick={() => openModal(p)}
              className="flex items-center gap-2.5 p-3 rounded-xl text-left active:opacity-75"
              style={{ backgroundColor: "#FFFFFF", border: "1px solid rgba(11,61,46,0.07)" }}>
              <ProviderBadge provider={p} size={34} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: "#1A1A1A" }}>{p.name}</p>
                <p className="text-xs capitalize" style={{ color: "#9CA3AF" }}>{p.type}</p>
              </div>
              <Plus size={14} style={{ color: "#0B3D2E" }} />
            </button>
          ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modal && (
          <motion.div key="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-end" style={{ backgroundColor: "rgba(0,0,0,0.55)", zIndex: 50 }}
            onClick={() => !connecting && setModal(null)}>
            <motion.div key="modal-sheet" initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="w-full rounded-t-3xl p-6 pb-10" style={{ backgroundColor: "#FFFFFF" }}
              onClick={e => e.stopPropagation()}>
              {success ? (
                <div className="flex flex-col items-center py-4">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: "#F0FDF4" }}>
                    <CheckCircle2 size={36} style={{ color: "#16A34A" }} />
                  </div>
                  <h3 className="font-bold text-lg mb-2" style={{ color: "#0B3D2E" }}>Connected!</h3>
                  <p className="text-sm text-center mb-6" style={{ color: "#6B7280" }}>
                    {modal.name} is now linked. Your data will sync in the background.
                  </p>
                  <button onClick={() => setModal(null)} className="w-full py-4 rounded-2xl text-white font-semibold"
                    style={{ backgroundColor: "#0B3D2E" }}>Done</button>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-bold text-lg" style={{ color: "#1A1A1A" }}>Connect {modal.name}</h3>
                    <button onClick={() => setModal(null)} className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: "#F5F3EF" }}>
                      <X size={16} style={{ color: "#9CA3AF" }} />
                    </button>
                  </div>
                  <div className="flex items-center gap-3 mb-5 p-3 rounded-xl" style={{ backgroundColor: "#F5F3EF" }}>
                    <ProviderBadge provider={modal} size={42} />
                    <div>
                      <p className="font-semibold" style={{ color: "#1A1A1A" }}>{modal.name}</p>
                      <p className="text-xs" style={{ color: "#9CA3AF" }}>Secure read-only connection</p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold mb-2" style={{ color: "#1A1A1A" }}>ORBIT will access:</p>
                  {["Account balance", "Transaction history (24 months)", "Account holder name"].map(item => (
                    <div key={item} className="flex items-center gap-2.5 py-1.5">
                      <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#F0FDF4" }}>
                        <Check size={10} style={{ color: "#16A34A" }} />
                      </div>
                      <p className="text-sm" style={{ color: "#4B5563" }}>{item}</p>
                    </div>
                  ))}
                  <div className="flex gap-2 p-3 rounded-xl my-4" style={{ backgroundColor: "#FFFBEB" }}>
                    <Info size={13} style={{ color: "#D97706", flexShrink: 0, marginTop: 2 }} />
                    <p className="text-xs leading-relaxed" style={{ color: "#92400E" }}>
                      ORBIT never stores your {modal.name} login credentials. Your password stays private and secure.
                    </p>
                  </div>
                  <button onClick={doConnect} disabled={connecting}
                    className="w-full py-4 rounded-2xl text-white font-semibold flex items-center justify-center gap-2"
                    style={{ backgroundColor: "#0B3D2E", opacity: connecting ? 0.75 : 1, boxShadow: "0 4px 16px rgba(11,61,46,0.3)" }}>
                    {connecting ? <><RefreshCw size={16} className="animate-spin" />Connecting…</> : `Connect ${modal.name}`}
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Insights Screen ──────────────────────────────────────────────────────────

function InsightsScreen() {
  const [metric, setMetric] = useState<"income" | "expenses">("income");
  const total = CATEGORIES.reduce((s, c) => s + c.amount, 0);

  return (
    <div className="flex-1 overflow-y-auto" style={{ backgroundColor: "#F5F3EF", scrollbarWidth: "none" }}>
      <div className="px-5 pt-4 pb-5" style={{ backgroundColor: "#0B3D2E" }}>
        <h1 className="text-white font-bold text-xl mb-0.5">Financial Insights</h1>
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>July 2025 · Kathmandu</p>
      </div>

      {/* Health Score */}
      <div className="mx-4 -mt-3 mb-4 rounded-2xl p-4"
        style={{ backgroundColor: "#FFFFFF", boxShadow: "0 2px 16px rgba(11,61,46,0.1)" }}>
        <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#9CA3AF" }}>Financial Health Score</p>
        <div className="flex items-center gap-4 mb-5">
          <ScoreGauge score={74} size={96} />
          <div>
            <p className="font-bold mb-0.5" style={{ fontSize: 32, color: "#0B3D2E", lineHeight: 1 }}>
              74<span className="text-sm font-normal" style={{ color: "#9CA3AF" }}>/100</span>
            </p>
            <p className="text-xs font-semibold mb-2" style={{ color: "#2D7A5A" }}>Good · ↑4 pts this month</p>
            <p className="text-xs leading-relaxed" style={{ color: "#9CA3AF" }}>
              Consistent savings and on-time repayments are boosting your score.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-3.5">
          {HEALTH_COMPONENTS.map(c => (
            <div key={c.label}>
              <div className="flex justify-between mb-1">
                <p className="text-xs font-medium" style={{ color: "#4B5563" }}>{c.label}</p>
                <p className="text-xs font-bold" style={{ color: "#0B3D2E" }}>{c.score}</p>
              </div>
              <ScoreBar score={c.score} color={c.score >= 80 ? "#16A34A" : c.score >= 60 ? "#0B3D2E" : "#D97706"} />
              <p className="text-xs mt-0.5" style={{ color: "#BDC9C4" }}>{c.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Flow */}
      <div className="mx-4 mb-4 rounded-2xl p-4"
        style={{ backgroundColor: "#FFFFFF", boxShadow: "0 2px 16px rgba(11,61,46,0.1)" }}>
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold" style={{ color: "#1A1A1A" }}>Monthly Cash Flow</p>
          <div className="flex gap-1.5">
            {(["income", "expenses"] as const).map(m => (
              <button key={m} onClick={() => setMetric(m)}
                className="px-2.5 py-1 rounded-full text-xs font-semibold"
                style={{ backgroundColor: metric === m ? "#0B3D2E" : "#F0EDE8", color: metric === m ? "#fff" : "#4B5563" }}>
                {m[0].toUpperCase() + m.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div style={{ height: 150 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MONTHLY_DATA} margin={{ top: 5, right: 5, left: -28, bottom: 0 }}>
              <defs>
                <linearGradient id="ig" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0B3D2E" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#0B3D2E" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="eg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C5161D" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#C5161D" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: "#9CA3AF" }} axisLine={false} tickLine={false} tickFormatter={v => `${v / 1000}k`} />
              <Tooltip formatter={(v: number) => [`NPR ${v.toLocaleString("en-IN")}`, ""]}
                contentStyle={{ fontSize: 11, borderRadius: 10, border: "none", boxShadow: "0 4px 16px rgba(0,0,0,0.12)" }} />
              <Area type="monotone" dataKey={metric} stroke={metric === "income" ? "#0B3D2E" : "#C5161D"}
                strokeWidth={2.5} fill={`url(#${metric === "income" ? "ig" : "eg"})`} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Spending categories */}
      <div className="mx-4 mb-4 rounded-2xl p-4"
        style={{ backgroundColor: "#FFFFFF", boxShadow: "0 2px 16px rgba(11,61,46,0.1)" }}>
        <p className="text-sm font-semibold mb-3" style={{ color: "#1A1A1A" }}>Spending by Category</p>
        <div style={{ height: 150 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={CATEGORIES} cx="50%" cy="50%" innerRadius={38} outerRadius={68} dataKey="amount" nameKey="name">
                {CATEGORIES.map((c, i) => <Cell key={i} fill={c.color} />)}
              </Pie>
              <Tooltip formatter={(v: number) => [`NPR ${v.toLocaleString("en-IN")}`, ""]}
                contentStyle={{ fontSize: 11, borderRadius: 10, border: "none", boxShadow: "0 4px 16px rgba(0,0,0,0.12)" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-y-2 gap-x-4 mt-1">
          {CATEGORIES.map(c => (
            <div key={c.name} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: c.color }} />
              <div className="flex-1 flex items-center justify-between min-w-0">
                <p className="text-xs truncate" style={{ color: "#4B5563" }}>{c.name}</p>
                <p className="text-xs font-semibold ml-1 flex-shrink-0" style={{ color: "#1A1A1A" }}>
                  {Math.round((c.amount / total) * 100)}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Opportunities */}
      <div className="px-4 pb-6">
        <p className="text-sm font-semibold mb-3" style={{ color: "#1A1A1A" }}>Opportunities for You</p>
        <div className="flex flex-col gap-2">
          {[
            { icon: TrendingUp, title: "Savings rate 26% — above average", desc: "Nepal average is 18%. Your discipline is your strength.", color: "#16A34A" },
            { icon: Award, title: "Micro-loan pre-qualified", desc: "Your payment history qualifies for loans up to NPR 1,00,000.", color: "#0B3D2E" },
            { icon: Shield, title: "Insurance gap identified", desc: "No active insurance found. Explore affordable options from NPR 500/month.", color: "#C5161D" },
          ].map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="flex items-start gap-3 p-3 rounded-2xl"
              style={{ backgroundColor: "#FFFFFF", border: "1px solid rgba(11,61,46,0.07)" }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${color}12` }}>
                <Icon size={17} style={{ color }} />
              </div>
              <div>
                <p className="text-sm font-semibold mb-0.5" style={{ color: "#1A1A1A" }}>{title}</p>
                <p className="text-xs leading-relaxed" style={{ color: "#6B7280" }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Passport Screen ──────────────────────────────────────────────────────────

function PassportScreen() {
  const [sharing, setSharing] = useState(false);

  return (
    <div className="flex-1 overflow-y-auto" style={{ backgroundColor: "#F5F3EF", scrollbarWidth: "none" }}>
      <div className="px-5 pt-4 pb-5" style={{ backgroundColor: "#0B3D2E" }}>
        <h1 className="text-white font-bold text-xl mb-0.5">Financial Passport</h1>
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>Your trusted financial identity</p>
      </div>

      {/* Passport card */}
      <div className="px-4 pt-4 mb-4">
        <div className="rounded-3xl overflow-hidden"
          style={{ background: "linear-gradient(145deg, #071F17 0%, #0B3D2E 55%, #1A5C42 100%)", boxShadow: "0 12px 40px rgba(7,31,23,0.5)" }}>

          {/* Header strip */}
          <div className="px-5 pt-5 pb-4">
            <div className="flex items-start justify-between mb-5">
              <div>
                <p className="text-xs uppercase tracking-widest mb-0.5" style={{ color: "rgba(255,255,255,0.35)", letterSpacing: "0.2em" }}>Financial Passport</p>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>Federal Democratic Republic of Nepal</p>
              </div>
              {/* NP flag colors */}
              <div className="flex items-center gap-0.5">
                <div className="w-5 h-5 rounded-full" style={{ backgroundColor: "#C5161D" }} />
                <div className="w-5 h-5 rounded-full -ml-1.5" style={{ backgroundColor: "#0B3D2E", border: "1.5px solid rgba(255,255,255,0.2)" }} />
              </div>
            </div>

            {/* Photo + name */}
            <div className="flex items-end gap-4">
              <div className="w-16 h-20 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "rgba(255,255,255,0.12)", border: "1.5px solid rgba(255,255,255,0.2)" }}>
                <p className="text-white text-xl font-bold">SS</p>
              </div>
              <div className="flex-1 pb-1">
                <p className="text-xs mb-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>Full Name</p>
                <p className="text-white font-bold text-base mb-2" style={{ letterSpacing: "0.05em" }}>SUNITA SHARMA</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                  <div>
                    <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>Member Since</p>
                    <p className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.75)" }}>March 2024</p>
                  </div>
                  <div>
                    <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>Location</p>
                    <p className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.75)" }}>Kathmandu</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="mx-5" style={{ height: 1, backgroundColor: "rgba(255,255,255,0.1)" }} />

          {/* Trust score */}
          <div className="px-5 py-4">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs uppercase tracking-wider mb-1" style={{ color: "rgba(255,255,255,0.4)" }}>Financial Trust Score</p>
                <p className="text-white font-bold" style={{ fontSize: 36, lineHeight: 1 }}>
                  78<span className="text-base font-normal" style={{ color: "rgba(255,255,255,0.4)" }}>/100</span>
                </p>
                <p className="text-xs font-semibold mt-1" style={{ color: "#86efac" }}>Good Standing</p>
              </div>
              {/* QR */}
              <div className="w-14 h-14 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}>
                <QrCode size={28} style={{ color: "rgba(255,255,255,0.5)" }} />
              </div>
            </div>
            {/* Score breakdown pills */}
            <div className="grid grid-cols-4 gap-2">
              {[{ l: "Income", s: 82 }, { l: "Savings", s: 68 }, { l: "Payments", s: 91 }, { l: "Business", s: 58 }].map(c => (
                <div key={c.l} className="rounded-xl py-2 px-1 text-center"
                  style={{ backgroundColor: "rgba(255,255,255,0.07)" }}>
                  <p className="font-bold text-white text-sm">{c.s}</p>
                  <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)", fontSize: 9 }}>{c.l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Passport ID footer */}
          <div className="px-5 py-3 flex items-center justify-between"
            style={{ backgroundColor: "rgba(0,0,0,0.25)", fontFamily: "monospace" }}>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)", letterSpacing: "0.12em" }}>ORB-NP-2024-047821</p>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(134,239,172,0.15)", color: "#86efac", fontSize: 10 }}>VALID · ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Score detail */}
      <div className="mx-4 mb-4 rounded-2xl p-4"
        style={{ backgroundColor: "#FFFFFF", boxShadow: "0 2px 16px rgba(11,61,46,0.08)" }}>
        <p className="text-sm font-semibold mb-4" style={{ color: "#1A1A1A" }}>Score Breakdown</p>
        {HEALTH_COMPONENTS.map((c, i) => (
          <div key={c.label} className={i < HEALTH_COMPONENTS.length - 1 ? "mb-4" : ""}>
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-sm font-medium" style={{ color: "#1A1A1A" }}>{c.label}</p>
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-bold" style={{ color: "#0B3D2E" }}>{c.score}/100</p>
                {c.score >= 80 ? <CheckCircle2 size={13} style={{ color: "#16A34A" }} />
                  : c.score < 65 ? <AlertTriangle size={13} style={{ color: "#D97706" }} /> : null}
              </div>
            </div>
            <ScoreBar score={c.score} color={c.score >= 80 ? "#16A34A" : c.score >= 60 ? "#0B3D2E" : "#D97706"} />
            <p className="text-xs mt-1" style={{ color: "#9CA3AF" }}>{c.description}</p>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="px-4 mb-4">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button onClick={() => setSharing(!sharing)}
            className="flex items-center justify-center gap-2 py-3.5 rounded-2xl text-white font-semibold text-sm"
            style={{ backgroundColor: "#0B3D2E", boxShadow: "0 4px 16px rgba(11,61,46,0.3)" }}>
            <Share2 size={15} />Share Passport
          </button>
          <button className="flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold text-sm"
            style={{ backgroundColor: "#E8F0EB", color: "#0B3D2E" }}>
            <Download size={15} />Download PDF
          </button>
        </div>

        <AnimatePresence>
          {sharing && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-4">
              <div className="p-4 rounded-2xl" style={{ backgroundColor: "#FFFFFF", border: "1px solid rgba(11,61,46,0.1)" }}>
                <p className="text-sm font-semibold mb-3" style={{ color: "#1A1A1A" }}>Share with...</p>
                <div className="flex gap-2 flex-wrap mb-3">
                  {["Bank Officer", "Loan Application", "Insurance Agent", "Employer"].map(r => (
                    <button key={r} className="px-3 py-1.5 rounded-full text-xs font-semibold"
                      style={{ backgroundColor: "#E8F0EB", color: "#0B3D2E" }}>{r}</button>
                  ))}
                </div>
                <p className="text-xs" style={{ color: "#9CA3AF" }}>Shared links expire in 24 hours. You control all access. <span style={{ color: "#C5161D" }}>Audit log →</span></p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-sm font-semibold mb-3" style={{ color: "#1A1A1A" }}>You May Qualify For</p>
        <div className="flex flex-col gap-2 pb-6">
          {[
            { title: "SKBBL Micro-Loan", desc: "Up to NPR 1,00,000 · 12% p.a. · Women entrepreneurs priority", badge: "Eligible", color: "#16A34A" },
            { title: "Nabil Bank SME Loan", desc: "Up to NPR 5,00,000 · Collateral may be waived based on your Passport", badge: "Likely Eligible", color: "#0B3D2E" },
            { title: "Beema Samiti Micro-Insurance", desc: "Agricultural coverage from NPR 500/month — 3 options available", badge: "Explore", color: "#D97706" },
          ].map(op => (
            <div key={op.title} className="flex items-start justify-between p-4 rounded-2xl"
              style={{ backgroundColor: "#FFFFFF", border: "1px solid rgba(11,61,46,0.07)" }}>
              <div className="flex-1 mr-3">
                <p className="text-sm font-semibold mb-0.5" style={{ color: "#1A1A1A" }}>{op.title}</p>
                <p className="text-xs leading-relaxed" style={{ color: "#6B7280" }}>{op.desc}</p>
              </div>
              <span className="flex-shrink-0 text-xs px-2.5 py-1 rounded-full font-semibold"
                style={{ backgroundColor: `${op.color}12`, color: op.color }}>{op.badge}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Security Screen ──────────────────────────────────────────────────────────

function SecurityScreen() {
  const [alerts, setAlerts] = useState<AlertItem[]>(ALERT_DATA);
  const unread = alerts.filter(a => !a.read).length;

  const markRead = (id: number) => setAlerts(alerts.map(a => a.id === id ? { ...a, read: true } : a));

  const iconConfig = {
    warning: { icon: AlertTriangle, color: "#D97706", bg: "#FFFBEB" },
    info: { icon: Info, color: "#2563EB", bg: "#EFF6FF" },
    success: { icon: CheckCircle2, color: "#16A34A", bg: "#F0FDF4" },
  };

  return (
    <div className="flex-1 overflow-y-auto" style={{ backgroundColor: "#F5F3EF", scrollbarWidth: "none" }}>
      <div className="px-5 pt-4 pb-5" style={{ backgroundColor: "#0B3D2E" }}>
        <h1 className="text-white font-bold text-xl mb-0.5">Security & Privacy</h1>
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
          {unread > 0 ? `${unread} unread alert${unread > 1 ? "s" : ""}` : "All clear — no issues detected"}
        </p>
      </div>

      {/* Alerts */}
      <div className="px-4 pt-4 mb-5">
        <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#9CA3AF" }}>Security Alerts</p>
        <div className="flex flex-col gap-2">
          {alerts.map(a => {
            const { icon: Icon, color, bg } = iconConfig[a.type];
            return (
              <div key={a.id} className="flex items-start gap-3 p-4 rounded-2xl transition-opacity"
                style={{
                  backgroundColor: "#FFFFFF",
                  border: `1px solid ${a.read ? "rgba(11,61,46,0.06)" : "rgba(197,22,29,0.15)"}`,
                  opacity: a.read ? 0.7 : 1
                }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: bg }}>
                  <Icon size={16} style={{ color }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-semibold" style={{ color: "#1A1A1A" }}>{a.title}</p>
                    {!a.read && <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: "#C5161D" }} />}
                  </div>
                  <p className="text-xs leading-relaxed mb-1.5" style={{ color: "#6B7280" }}>{a.message}</p>
                  <div className="flex items-center gap-3">
                    <p className="text-xs" style={{ color: "#BDC9C4" }}>{a.time}</p>
                    {!a.read && (
                      <button onClick={() => markRead(a.id)} className="text-xs font-semibold" style={{ color: "#0B3D2E" }}>
                        Mark read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Data Permissions */}
      <div className="px-4 mb-5">
        <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#9CA3AF" }}>Data Permissions</p>
        <div className="flex flex-col gap-2">
          {PROVIDERS.filter(p => p.connected).map(p => (
            <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl"
              style={{ backgroundColor: "#FFFFFF", border: "1px solid rgba(11,61,46,0.07)" }}>
              <ProviderBadge provider={p} size={34} />
              <div className="flex-1">
                <p className="text-sm font-medium" style={{ color: "#1A1A1A" }}>{p.name}</p>
                <p className="text-xs" style={{ color: "#9CA3AF" }}>Read-only · Balances & Transactions</p>
              </div>
              {/* Toggle ON */}
              <div className="w-10 h-5.5 rounded-full relative flex-shrink-0 flex items-center px-0.5"
                style={{ backgroundColor: "#0B3D2E", height: 22, width: 40 }}>
                <div className="w-4 h-4 rounded-full bg-white absolute right-1" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy controls */}
      <div className="px-4 pb-6">
        <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#9CA3AF" }}>Privacy Controls</p>
        <div className="flex flex-col gap-2">
          {[
            { label: "Biometric Authentication", desc: "Face ID or Fingerprint login", on: true },
            { label: "Transaction Alerts", desc: "Notified for every transaction", on: true },
            { label: "Passport Access Log", desc: "Track every time your Passport is viewed", on: true },
            { label: "Anonymous Analytics", desc: "Help improve ORBIT for Nepal (optional)", on: false },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-3 p-3.5 rounded-xl"
              style={{ backgroundColor: "#FFFFFF", border: "1px solid rgba(11,61,46,0.07)" }}>
              <div className="flex-1">
                <p className="text-sm font-medium" style={{ color: "#1A1A1A" }}>{item.label}</p>
                <p className="text-xs" style={{ color: "#9CA3AF" }}>{item.desc}</p>
              </div>
              <div className="flex items-center relative flex-shrink-0"
                style={{ width: 40, height: 22, backgroundColor: item.on ? "#0B3D2E" : "#E5E7EB", borderRadius: 11 }}>
                <div className="absolute w-4 h-4 rounded-full bg-white transition-all"
                  style={{ right: item.on ? 3 : undefined, left: item.on ? undefined : 3 }} />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-4 rounded-2xl"
          style={{ backgroundColor: "#E8F0EB", border: "1px solid rgba(11,61,46,0.12)" }}>
          <div className="flex items-center gap-2 mb-1">
            <MapPin size={13} style={{ color: "#0B3D2E" }} />
            <p className="text-xs font-semibold" style={{ color: "#0B3D2E" }}>Last active</p>
          </div>
          <p className="text-xs" style={{ color: "#4B5563" }}>
            Samsung Galaxy S23 · Kathmandu, Nepal · Today at 10:42 AM
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Tab Bar ──────────────────────────────────────────────────────────────────

const TABS: Array<{ id: MainTab; Icon: React.ElementType; label: string }> = [
  { id: "home", Icon: Home, label: "Home" },
  { id: "connect", Icon: Link2, label: "Connect" },
  { id: "insights", Icon: BarChart3, label: "Insights" },
  { id: "passport", Icon: Award, label: "Passport" },
  { id: "security", Icon: Shield, label: "Security" },
];

function TabBar({ active, onChange }: { active: MainTab; onChange: (t: MainTab) => void }) {
  return (
    <div className="flex items-center justify-around pt-2 pb-4 flex-shrink-0"
      style={{ backgroundColor: "#FFFFFF", borderTop: "1px solid rgba(11,61,46,0.08)" }}>
      {TABS.map(({ id, Icon, label }) => {
        const on = active === id;
        return (
          <button key={id} onClick={() => onChange(id)}
            className="flex flex-col items-center gap-1 px-2 py-1.5 rounded-xl transition-all"
            style={{ backgroundColor: on ? "#E8F0EB" : "transparent", minWidth: 60 }}>
            <Icon size={20} style={{ color: on ? "#0B3D2E" : "#BDC9C4" }} />
            <p className="text-xs font-semibold" style={{ color: on ? "#0B3D2E" : "#BDC9C4", fontSize: 10 }}>{label}</p>
          </button>
        );
      })}
    </div>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [phase, setPhase] = useState<AppPhase>("onboarding");
  const [step, setStep] = useState<OnboardingStep>("splash");
  const [tab, setTab] = useState<MainTab>("home");

  const advanceOnboarding = useCallback(() => {
    if (step === "splash") setStep("welcome");
    else if (step === "welcome") setStep("pin");
    else setPhase("main");
  }, [step]);

  // Determine status bar appearance
  const statusBg = phase === "onboarding" && step !== "splash" ? "#F5F3EF" : "#0B3D2E";
  const statusLight = statusBg === "#0B3D2E";

  const renderScreen = () => {
    switch (tab) {
      case "home": return <HomeScreen onNavigateTab={setTab} />;
      case "connect": return <ConnectScreen />;
      case "insights": return <InsightsScreen />;
      case "passport": return <PassportScreen />;
      case "security": return <SecurityScreen />;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center"
      style={{ background: "linear-gradient(145deg, #040F09 0%, #071F17 40%, #0B3D2E 100%)" }}>

      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(11,61,46,0.4) 0%, transparent 70%)"
      }} />

      {/* Phone frame */}
      <div className="relative flex flex-col overflow-hidden flex-shrink-0"
        style={{
          width: 390, height: 844,
          borderRadius: 46,
          backgroundColor: "#F5F3EF",
          boxShadow: "0 40px 100px rgba(0,0,0,0.7), 0 0 0 7px #0D0D0D, 0 0 0 9px #2A2A2A, 0 0 0 10px #1A1A1A",
        }}>

        {/* Dynamic Island */}
        <div className="absolute left-1/2 -translate-x-1/2 z-20 flex items-center justify-center"
          style={{ top: 12, width: 120, height: 34, backgroundColor: "#000", borderRadius: 20 }} />

        {/* Status bar */}
        <div className="relative z-10 flex items-center justify-between px-7 flex-shrink-0"
          style={{ backgroundColor: statusBg, paddingTop: 14, paddingBottom: 8, height: 50, transition: "background-color 0.3s" }}>
          <p className="text-xs font-semibold" style={{ color: statusLight ? "rgba(255,255,255,0.9)" : "#1A1A1A" }}>9:41</p>
          {/* Signal + battery */}
          <div className="flex items-center gap-1.5">
            <div className="flex items-end gap-0.5">
              {[3,4,5,6].map(h => (
                <div key={h} className="w-0.5 rounded-sm"
                  style={{ height: h, backgroundColor: statusLight ? "rgba(255,255,255,0.85)" : "#1A1A1A" }} />
              ))}
            </div>
            <div className="flex items-center rounded-sm border px-0.5"
              style={{ width: 22, height: 12, borderColor: statusLight ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>
              <div className="flex-1 rounded-sm h-1.5"
                style={{ backgroundColor: statusLight ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.75)" }} />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 relative overflow-hidden flex flex-col">
          {phase === "onboarding" ? (
            <AnimatePresence mode="wait">
              {step === "splash" && (
                <motion.div key="splash" className="absolute inset-0"
                  exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
                  <SplashScreen onNext={advanceOnboarding} />
                </motion.div>
              )}
              {step === "welcome" && (
                <motion.div key="welcome" className="absolute inset-0"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
                  <WelcomeScreen onNext={advanceOnboarding} />
                </motion.div>
              )}
              {step === "pin" && (
                <motion.div key="pin" className="absolute inset-0"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                  <PinScreen onNext={advanceOnboarding} />
                </motion.div>
              )}
            </AnimatePresence>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div key={tab} className="flex flex-col h-full"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.18 }}>
                {renderScreen()}
                <TabBar active={tab} onChange={setTab} />
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}
