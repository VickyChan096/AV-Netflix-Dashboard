import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { TitleEntry } from "@/lib/tracker-storage";
import { StarRating } from "./StarRating";
import { Film, Tv } from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entry: TitleEntry | null;
};

function fmt(date?: string): string | null {
  if (!date) return null;
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

export function TitleDetails({ open, onOpenChange, entry }: Props) {
  if (!entry) return null;

  const you = entry.rating?.you ?? 0;
  const allen = entry.rating?.bf ?? 0;
  const hasRating = you > 0 || allen > 0;
  const watched = entry.status === "watched";

  const dateLine =
    entry.type === "series"
      ? [fmt(entry.watchedStart), fmt(entry.watchedEnd)].some(Boolean)
        ? `${fmt(entry.watchedStart) ?? "—"} ~ ${fmt(entry.watchedEnd) ?? "—"}`
        : null
      : fmt(entry.watchedTogetherOn);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{entry.title}</DialogTitle>
          <DialogDescription>
            {watched ? "已看過" : "期望名單"}
            {entry.genre ? ` · ${entry.genre}` : ""}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2 sm:grid-cols-[180px_1fr]">
          <div className="bg-secondary/40 ring-border relative aspect-[2/3] overflow-hidden rounded-md ring-1">
            {entry.coverUrl ? (
              <img
                src={entry.coverUrl}
                alt={entry.title}
                className="absolute inset-0 h-full w-full object-cover"
                onError={(e) =>
                  ((e.currentTarget as HTMLImageElement).style.opacity = "0.2")
                }
              />
            ) : (
              <div className="text-muted-foreground/50 flex h-full items-center justify-center">
                {entry.type === "movie" ? (
                  <Film className="h-12 w-12" />
                ) : (
                  <Tv className="h-12 w-12" />
                )}
              </div>
            )}
          </div>

          <div className="grid content-start gap-4">
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="border-primary text-primary rounded border px-2 py-0.5 font-semibold">
                {entry.type === "movie" ? "電影" : "劇集"}
              </span>
              {entry.genre && (
                <span className="text-muted-foreground">{entry.genre}</span>
              )}
            </div>

            {watched && hasRating && (
              <div className="border-border bg-secondary/30 grid gap-3 rounded-md border p-4">
                <div className="text-sm font-semibold">兩人評分</div>
                <StarRating label="Vicky" value={you} readOnly />
                <StarRating label="Allen" value={allen} readOnly />
              </div>
            )}

            {watched && dateLine && (
              <div className="text-sm">
                <span className="text-muted-foreground">
                  {entry.type === "series" ? "追劇期間" : "一起看的日期"}：
                </span>
                {dateLine}
              </div>
            )}

            {entry.note && (
              <div className="text-sm">
                <div className="text-muted-foreground mb-1">心得</div>
                <p className="leading-relaxed whitespace-pre-wrap">{entry.note}</p>
              </div>
            )}

            {!watched && !entry.note && (
              <p className="text-muted-foreground text-sm">還沒看，先加進清單裡。</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
