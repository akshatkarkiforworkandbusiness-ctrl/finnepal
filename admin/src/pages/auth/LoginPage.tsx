import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronsRight, Lock, Mail, Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { EnvironmentBadge } from "@/components/admin/EnvironmentBadge";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/lib/api";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await login(email, password, rememberMe);
      toast.success("Signed in", { description: "Welcome back to Orbit Admin." });
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Could not reach the Orbit API.";
      toast.error("Sign in failed", { description: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <ChevronsRight className="h-6 w-6" />
          </span>
          <p className="mt-3 text-lg font-semibold tracking-tight text-foreground">ORBIT</p>
          <p className="text-xs text-muted-foreground">Fintech Operations</p>
        </div>

        <Card className="p-6">
          <div className="mb-5 flex items-center justify-between">
            <h1 className="text-lg font-semibold text-foreground">Admin Portal</h1>
            <EnvironmentBadge />
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 pr-9"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox id="remember" checked={rememberMe} onCheckedChange={(v) => setRememberMe(v === true)} />
              <Label htmlFor="remember" className="text-sm font-normal text-muted-foreground">
                Remember me
              </Label>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in"}
            </Button>
          </form>
        </Card>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Orbit Admin · authenticated via the live API
        </p>
      </div>
    </div>
  );
}
