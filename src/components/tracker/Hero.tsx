import { Info } from "lucide-react";
import type { TitleEntry } from "@/lib/tracker-storage";
import { avgRating } from "@/lib/tracker-utils";

type Props = {
  entry: TitleEntry | null;
  onOpen: (entry: TitleEntry) => void;
};

export function Hero({ entry, onOpen }: Props) {
  if (!entry) {
    return (
      <div className="relative flex h-[60vh] min-h-[420px] items-center justify-center overflow-hidden">
        <div className="from-primary/30 via-background to-background absolute inset-0 bg-gradient-to-br" />
        <div className="relative z-10 max-w-2xl px-6 text-center">
          <p className="text-primary text-sm font-semibold tracking-[0.3em] uppercase">
            兩人份的觀影紀錄
          </p>
          <h1 className="mt-3 text-4xl leading-tight font-black sm:text-6xl">
            開始你們的
            <br />
            片單旅程
          </h1>
          <p className="text-muted-foreground mt-4 text-lg">
            記錄想看、看過、一起打分。每個月至少一部電影，一起追一部劇。
          </p>
        </div>
      </div>
    );
  }

  const rating = avgRating(entry.rating);

  return (
    <div className="relative h-[70vh] min-h-[480px] w-full overflow-hidden">
      {entry.coverUrl ? (
        <img
          src={entry.coverUrl}
          alt={entry.title}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="from-primary/40 to-background absolute inset-0 bg-gradient-to-br" />
      )}
      <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
      <div className="absolute inset-0" style={{ background: "var(--gradient-hero-left)" }} />

      <div className="relative z-10 flex h-full items-end pb-16 sm:items-center sm:pb-0">
        <div className="max-w-2xl px-6 sm:px-12">
          <span className="text-primary text-xs font-bold tracking-[0.3em] uppercase">
            {entry.status === "wishlist" ? "今日推薦 · 期望清單" : "精選"}
          </span>
          <h1 className="mt-3 text-4xl leading-[0.95] font-black drop-shadow-lg sm:text-6xl">
            {entry.title}
          </h1>
          <div className="mt-3 flex items-center gap-3 text-sm">
            <span className="border-primary text-primary rounded border px-2 py-0.5 font-semibold">
              {entry.type === "movie" ? "電影" : "劇集"}
            </span>
            {entry.genre && <span className="text-white/80">{entry.genre}</span>}
            {rating > 0 && (
              <span className="text-[var(--gold)]">★ {rating.toFixed(1)}</span>
            )}
          </div>
          {entry.note && (
            <p className="mt-4 line-clamp-3 max-w-lg text-lg text-white/85 drop-shadow">
              {entry.note}
            </p>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => onOpen(entry)}
              className="inline-flex items-center gap-2 rounded-md bg-white px-6 py-2.5 text-base font-semibold text-black transition-colors hover:bg-white/90"
            >
              <Info className="h-4 w-4" /> 查看內容
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
