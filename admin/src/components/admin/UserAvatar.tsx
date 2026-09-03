import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

interface UserAvatarProps {
  name: string;
  subtitle?: string;
  className?: string;
  size?: "sm" | "md";
}

export function UserAvatar({ name, subtitle, className, size = "md" }: UserAvatarProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Avatar className={cn(size === "sm" ? "h-8 w-8" : "h-9 w-9")}>
        <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">{initials(name)}</AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-foreground">{name}</p>
        {subtitle && <p className="truncate text-xs text-muted-foreground">{subtitle}</p>}
      </div>
    </div>
  );
}
