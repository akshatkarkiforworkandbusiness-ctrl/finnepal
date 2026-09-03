import * as React from "react";
import { Search } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

// Lightweight command palette (no external cmdk dependency required).
interface CtxType {
  query: string;
  setQuery: (v: string) => void;
}
const Ctx = React.createContext<CtxType>({ query: "", setQuery: () => {} });

export function CommandDialog({
  open,
  onOpenChange,
  children,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  children: React.ReactNode;
}) {
  const [query, setQuery] = React.useState("");
  React.useEffect(() => {
    if (!open) setQuery("");
  }, [open]);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-0 sm:max-w-lg">
        <Ctx.Provider value={{ query, setQuery }}>{children}</Ctx.Provider>
      </DialogContent>
    </Dialog>
  );
}

export function CommandInput({ placeholder }: { placeholder?: string }) {
  const { query, setQuery } = React.useContext(Ctx);
  return (
    <div className="flex items-center border-b px-3">
      <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
      <input
        autoFocus
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="flex h-12 w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
      />
    </div>
  );
}

export function CommandList({ children }: { children: React.ReactNode }) {
  return <div className="max-h-80 overflow-y-auto p-1">{children}</div>;
}

export function CommandEmpty({ children }: { children: React.ReactNode }) {
  return <p className="py-6 text-center text-sm text-muted-foreground">{children}</p>;
}

export function CommandGroup({ heading, children }: { heading?: string; children: React.ReactNode }) {
  return (
    <div className="py-1">
      {heading && <p className="px-2 py-1.5 text-xs font-medium text-muted-foreground">{heading}</p>}
      {children}
    </div>
  );
}

export function CommandItem({
  children,
  onSelect,
  className,
}: {
  children: React.ReactNode;
  onSelect?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex w-full cursor-pointer items-center rounded-sm px-2 py-2 text-left text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground",
        className
      )}
    >
      {children}
    </button>
  );
}
