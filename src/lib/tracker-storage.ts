// Data model for OURFLIX entries.
//
// The app is READ-ONLY: it renders from src/data/watchlist.json.
// See src/lib/watchlist.ts for how the JSON is validated and mapped into
// the TitleEntry shape used across the UI components.

export type TitleType = "movie" | "series";
export type Status = "wishlist" | "watched";

export type Rating = {
  you: number; // Vicky, 0-5 (0 = 未評分)
  bf: number; // Allen, 0-5 (0 = 未評分)
};

export type TitleEntry = {
  id: string;
  title: string;
  type: TitleType;
  genre?: string;
  coverUrl?: string;
  status: Status;
  addedAt: string; // ISO (may be empty for file-sourced data)
  watchedAt?: string; // ISO — drives monthly goal / yearly stats
  watchedTogetherOn?: string; // movie: the single date watched together
  watchedStart?: string; // series: date started watching
  watchedEnd?: string; // series: date finished watching
  rating?: Rating;
  note?: string;
};
