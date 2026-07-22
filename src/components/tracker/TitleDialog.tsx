import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TitleEntry, TitleType, Status } from "@/lib/tracker-storage";
import { StarRating } from "./StarRating";
import { Film, Tv, Trash2 } from "lucide-react";

type Mode = "add" | "edit";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: Mode;
  entry?: TitleEntry | null;
  defaultStatus?: Status;
  onSave: (data: Partial<TitleEntry> & { title: string; type: TitleType }) => void;
  onDelete?: (id: string) => void;
  onMarkWatched?: (id: string) => void;
};

const GENRES = [
  "動作",
  "愛情",
  "喜劇",
  "懸疑",
  "驚悚",
  "科幻",
  "劇情",
  "動畫",
  "紀錄片",
  "恐怖",
  "奇幻",
  "犯罪",
];

export function TitleDialog({
  open,
  onOpenChange,
  mode,
  entry,
  defaultStatus,
  onSave,
  onDelete,
  onMarkWatched,
}: Props) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState<TitleType>("movie");
  const [genre, setGenre] = useState<string>("");
  const [coverUrl, setCoverUrl] = useState("");
  const [status, setStatus] = useState<Status>("wishlist");
  const [you, setYou] = useState(0);
  const [bf, setBf] = useState(0);
  const [watchedTogetherOn, setWatchedTogetherOn] = useState("");
  const [watchedStart, setWatchedStart] = useState("");
  const [watchedEnd, setWatchedEnd] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!open) return;
    if (entry) {
      setTitle(entry.title);
      setType(entry.type);
      setGenre(entry.genre ?? "");
      setCoverUrl(entry.coverUrl ?? "");
      setStatus(entry.status);
      setYou(entry.rating?.you ?? 0);
      setBf(entry.rating?.bf ?? 0);
      setWatchedTogetherOn(entry.watchedTogetherOn ?? "");
      setWatchedStart(entry.watchedStart ?? "");
      setWatchedEnd(entry.watchedEnd ?? "");
      setNote(entry.note ?? "");
    } else {
      setTitle("");
      setType("movie");
      setGenre("");
      setCoverUrl("");
      setStatus(defaultStatus ?? "wishlist");
      setYou(0);
      setBf(0);
      setWatchedTogetherOn("");
      setWatchedStart("");
      setWatchedEnd("");
      setNote("");
    }
  }, [open, entry, defaultStatus]);

  const submit = () => {
    if (!title.trim()) return;
    const isSeries = type === "series";
    // For series, treat the finish date as when it was "watched" so that the
    // monthly goal / yearly stats land in the month it was completed.
    const seriesWatchedAt =
      isSeries && watchedEnd ? new Date(watchedEnd).toISOString() : undefined;
    onSave({
      title: title.trim(),
      type,
      genre: genre || undefined,
      coverUrl: coverUrl.trim() || undefined,
      status,
      rating: you || bf ? { you, bf } : undefined,
      watchedTogetherOn: isSeries ? undefined : watchedTogetherOn || undefined,
      watchedStart: isSeries ? watchedStart || undefined : undefined,
      watchedEnd: isSeries ? watchedEnd || undefined : undefined,
      note: note.trim() || undefined,
      watchedAt:
        status === "watched"
          ? seriesWatchedAt ?? entry?.watchedAt ?? new Date().toISOString()
          : undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {mode === "add" ? "新增片單" : "編輯資料"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add" ? "把想看或看過的加進來" : "更新資訊、打分或留下心得"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2 sm:grid-cols-[180px_1fr]">
          <div className="bg-secondary/40 ring-border relative aspect-[2/3] overflow-hidden rounded-md ring-1">
            {coverUrl ? (
              <img
                src={coverUrl}
                alt="preview"
                className="absolute inset-0 h-full w-full object-cover"
                onError={(e) =>
                  ((e.currentTarget as HTMLImageElement).style.opacity = "0.2")
                }
              />
            ) : (
              <div className="text-muted-foreground/50 flex h-full items-center justify-center">
                {type === "movie" ? (
                  <Film className="h-12 w-12" />
                ) : (
                  <Tv className="h-12 w-12" />
                )}
              </div>
            )}
          </div>

          <div className="grid gap-3">
            <div className="grid gap-1.5">
              <Label>片名 *</Label>
              <Input
                autoFocus
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="例：柏捷頓家族"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label>類型</Label>
                <Select value={type} onValueChange={(v) => setType(v as TitleType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="movie">電影</SelectItem>
                    <SelectItem value="series">劇集</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1.5">
                <Label>分類</Label>
                <Select
                  value={genre || "none"}
                  onValueChange={(v) => setGenre(v === "none" ? "" : v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="選擇分類" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">未分類</SelectItem>
                    {GENRES.map((g) => (
                      <SelectItem key={g} value={g}>
                        {g}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-1.5">
              <Label>封面圖 URL</Label>
              <Input
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
                placeholder="https://... (右鍵複製圖片網址)"
              />
            </div>

            <div className="grid gap-1.5">
              <Label>狀態</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as Status)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wishlist">期望名單</SelectItem>
                  <SelectItem value="watched">已看過</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {status === "watched" && (
          <div className="border-border bg-secondary/30 grid gap-3 rounded-md border p-4">
            <div className="text-sm font-semibold">兩人評分</div>
            <StarRating label="Vicky" value={you} onChange={setYou} />
            <StarRating label="Allen" value={bf} onChange={setBf} />
            {type === "series" ? (
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1.5">
                  <Label className="text-xs">開始看的日期</Label>
                  <Input
                    type="date"
                    value={watchedStart}
                    onChange={(e) => setWatchedStart(e.target.value)}
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label className="text-xs">看完的日期</Label>
                  <Input
                    type="date"
                    value={watchedEnd}
                    onChange={(e) => setWatchedEnd(e.target.value)}
                  />
                </div>
              </div>
            ) : (
              <div className="grid gap-1.5">
                <Label className="text-xs">一起看的日期</Label>
                <Input
                  type="date"
                  value={watchedTogetherOn}
                  onChange={(e) => setWatchedTogetherOn(e.target.value)}
                />
              </div>
            )}
            <div className="grid gap-1.5">
              <Label className="text-xs">觀後心得</Label>
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="兩個人的感想、金句、彩蛋…"
                rows={3}
              />
            </div>
          </div>
        )}

        <DialogFooter className="flex flex-row items-center justify-between gap-2 sm:justify-between">
          <div>
            {mode === "edit" && onDelete && entry && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onDelete(entry.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="mr-1 h-4 w-4" /> 刪除
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            {mode === "edit" &&
              entry?.status === "wishlist" &&
              onMarkWatched && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    onMarkWatched(entry.id);
                    onOpenChange(false);
                  }}
                >
                  標記已看完
                </Button>
              )}
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button type="button" onClick={submit} disabled={!title.trim()}>
              儲存
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}