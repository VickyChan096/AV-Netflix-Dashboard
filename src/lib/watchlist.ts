import { z } from "zod";
import type { TitleEntry } from "./tracker-storage";
import rawData from "@/data/watchlist.json";

/**
 * Schema for one entry in src/data/watchlist.json.
 * Field names are intentionally human-friendly for hand-editing —
 * see 如何更新片單.md at the repo root.
 */
const RawEntrySchema = z.object({
  title: z.string().min(1, "片名 title 不能空白"),
  type: z.enum(["movie", "series"]),
  status: z.enum(["wishlist", "watched"]),
  genre: z.string().optional(),
  cover: z.string().optional(),
  ratingVicky: z.number().min(0).max(5).optional(),
  ratingAllen: z.number().min(0).max(5).optional(),
  watchedOn: z.string().optional(),
  startedOn: z.string().optional(),
  finishedOn: z.string().optional(),
  note: z.string().optional(),
});

const WatchlistSchema = z.array(RawEntrySchema);

type RawEntry = z.infer<typeof RawEntrySchema>;

export type LoadResult = { entries: TitleEntry[]; error: string | null };

function slug(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9一-鿿-]/g, "")
    .slice(0, 24);
}

/** Turn a "YYYY-MM-DD" (or any parseable) date string into an ISO string. */
function toIso(date?: string): string | undefined {
  if (!date) return undefined;
  const d = new Date(date);
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
}

function toEntry(r: RawEntry, index: number): TitleEntry {
  const isSeries = r.type === "series";
  const finishDate = isSeries ? r.finishedOn : r.watchedOn;
  const rating =
    r.ratingVicky || r.ratingAllen
      ? { you: r.ratingVicky ?? 0, bf: r.ratingAllen ?? 0 }
      : undefined;

  return {
    id: `${index}-${slug(r.title)}`,
    title: r.title,
    type: r.type,
    status: r.status,
    genre: r.genre || undefined,
    coverUrl: r.cover || undefined,
    addedAt: "",
    watchedAt: r.status === "watched" ? toIso(finishDate) : undefined,
    watchedTogetherOn: isSeries ? undefined : r.watchedOn || undefined,
    watchedStart: isSeries ? r.startedOn || undefined : undefined,
    watchedEnd: isSeries ? r.finishedOn || undefined : undefined,
    rating,
    note: r.note || undefined,
  };
}

/**
 * Parse and validate the watchlist JSON at module load.
 * On any schema error we return a human-readable message (in Chinese) that
 * points at the offending entry, so a typo shows a clear on-screen hint
 * rather than a blank page.
 */
export function loadWatchlist(): LoadResult {
  const parsed = WatchlistSchema.safeParse(rawData);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    const idx = typeof issue.path[0] === "number" ? issue.path[0] : null;
    const field = issue.path.slice(1).join(".");
    const where =
      idx !== null
        ? `第 ${idx + 1} 筆資料${field ? `的「${field}」欄位` : ""}`
        : "資料";
    return { entries: [], error: `${where}有問題：${issue.message}` };
  }
  return { entries: parsed.data.map(toEntry), error: null };
}
