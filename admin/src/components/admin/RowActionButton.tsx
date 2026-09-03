import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface RowActionButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  destructive?: boolean;
}

/** Inline icon button for a DataTable row action, with a tooltip carrying the label. */
export function RowActionButton({ icon: Icon, label, onClick, destructive }: RowActionButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn("h-8 w-8", destructive && "text-[#C5161D] hover:bg-red-50 hover:text-[#C5161D]")}
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          aria-label={label}
        >
          <Icon className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}
