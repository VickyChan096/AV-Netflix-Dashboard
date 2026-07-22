import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  value: number;
  onChange?: (v: number) => void;
  size?: number;
  label?: string;
  readOnly?: boolean;
};

export function StarRating({ value, onChange, size = 20, label, readOnly }: Props) {
  return (
    <div className="flex items-center gap-2">
      {label && (
        <span className="text-muted-foreground w-16 shrink-0 text-sm">{label}</span>
      )}
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((n) => {
          const active = n <= value;
          return (
            <button
              key={n}
              type="button"
              disabled={readOnly}
              onClick={() => onChange?.(value === n ? 0 : n)}
              className={cn(
                "rounded-sm transition-transform",
                !readOnly && "hover:scale-110 cursor-pointer",
                readOnly && "cursor-default",
              )}
              aria-label={`${n} star`}
            >
              <Star
                style={{ width: size, height: size }}
                className={cn(
                  "transition-colors",
                  active
                    ? "fill-[var(--gold)] text-[var(--gold)]"
                    : "text-muted-foreground/40",
                )}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}