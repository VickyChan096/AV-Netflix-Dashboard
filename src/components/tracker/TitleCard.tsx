import { Film, Tv, Star, Check } from "lucide-react";
import type { TitleEntry } from "@/lib/tracker-storage";
import { avgRating } from "@/lib/tracker-utils";
import { cn } from "@/lib/utils";

type Props = {
  entry: TitleEntry;
  onOpen: (entry: TitleEntry) => void;
};

export function TitleCard({ entry, onOpen }: Props) {
  const rating = avgRating(entry.rating);
  return (
    <button
      type="button"
      onClick={() => onOpen(entry)}
      className={cn(
        "group relative shrink-0 overflow-hidden rounded-md text-left",
        "w-[160px] sm:w-[180px] md:w-[200px]",
        "aspect-[2/3] bg-card",
        "ring-1 ring-white/5 transition-all duration-300",
        "hover:z-10 hover:scale-105 hover:ring-2 hover:ring-primary hover:shadow-[var(--shadow-red)]",
      )}
    >
      {entry.coverUrl ? (
        <img
          src={entry.coverUrl}
          alt={entry.title}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
      ) : (
        <div className="from-secondary to-card absolute inset-0 flex items-center justify-center bg-gradient-to-br">
          {entry.type === "movie" ? (
            <Film className="text-muted-foreground/50 h-12 w-12" />
          ) : (
            <Tv className="text-muted-foreground/50 h-12 w-12" />
          )}
        </div>
      )}

      <span className="bg-background/80 absolute top-2 left-2 flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium tracking-wide uppercase backdrop-blur">
        {entry.type === "movie" ? (
          <Film className="h-3 w-3" />
        ) : (
          <Tv className="h-3 w-3" />
        )}
        {entry.type === "movie" ? "電影" : "劇集"}
      </span>

      {rating > 0 && (
        <span className="bg-background/80 absolute top-2 right-2 flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[11px] font-semibold backdrop-blur">
          <Star className="fill-[var(--gold)] text-[var(--gold)]" size={11} />
          {rating.toFixed(1)}
        </span>
      )}

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-3 pt-8">
        <h3 className="line-clamp-2 text-sm leading-tight font-semibold text-white">
          {entry.title}
        </h3>
        {entry.genre && (
          <p className="mt-0.5 line-clamp-1 text-[11px] text-white/60">{entry.genre}</p>
        )}
      </div>

      {entry.status === "watched" && (
        <span className="bg-primary text-primary-foreground absolute right-2 bottom-2 flex h-6 w-6 items-center justify-center rounded-full opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
          <Check size={14} />
        </span>
      )}
    </button>
  );
}