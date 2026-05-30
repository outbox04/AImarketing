import type { ContentPost } from "@/types/content";

const days = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "CN"];

function stripVietnamese(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
}

function parseVietnamDate(value: string) {
  const normalized = stripVietnamese(value);
  const now = new Date();

  if (normalized.includes("hom nay")) {
    return now;
  }

  if (normalized.includes("ngay mai")) {
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    return tomorrow;
  }

  const isoMatch = value.match(/\b(\d{4})[-/](\d{1,2})[-/](\d{1,2})\b/);
  if (isoMatch) {
    return new Date(Number(isoMatch[1]), Number(isoMatch[2]) - 1, Number(isoMatch[3]));
  }

  const vietnamMatch = value.match(/\b(\d{1,2})[/-](\d{1,2})(?:[/-](\d{2,4}))?\b/);
  if (vietnamMatch) {
    const year = vietnamMatch[3] ? Number(vietnamMatch[3].length === 2 ? `20${vietnamMatch[3]}` : vietnamMatch[3]) : now.getFullYear();
    return new Date(year, Number(vietnamMatch[2]) - 1, Number(vietnamMatch[1]));
  }

  return null;
}

function getWeekdayIndex(value: string) {
  const parsedDate = parseVietnamDate(value);
  if (parsedDate && !Number.isNaN(parsedDate.getTime())) {
    const day = parsedDate.getDay();
    return day === 0 ? 6 : day - 1;
  }

  const normalized = stripVietnamese(value);
  if (normalized.includes("chu nhat") || normalized.includes("cn")) return 6;

  const weekdayMatch = normalized.match(/thu\s*(2|3|4|5|6|7)/);
  return weekdayMatch ? Number(weekdayMatch[1]) - 2 : -1;
}

export function ContentCalendar({ contentPosts }: { contentPosts: ContentPost[] }) {
  return (
    <div className="grid gap-4 lg:grid-cols-7">
      {days.map((day, index) => {
        const postsInDay = contentPosts.filter((post) => getWeekdayIndex(post.scheduledAt) === index);

        return (
          <div key={day} className="min-h-48 rounded-card border border-border bg-white p-4 shadow-card">
            <p className="mb-3 text-sm font-bold text-text-main">{day}</p>
            <div className="space-y-3">
              {postsInDay.length > 0 ? (
                postsInDay.map((post) => (
                  <div key={post.id} className="rounded-2xl bg-surface-soft p-3">
                    <p className="text-xs font-bold text-primary">{post.channel}</p>
                    <p className="mt-1 text-sm font-semibold text-text-main">{post.title}</p>
                    <p className="mt-1 text-xs text-text-muted">{post.scheduledAt || "Chưa có ngày đăng"}</p>
                  </div>
                ))
              ) : (
                <p className="rounded-2xl bg-surface-soft p-3 text-xs font-semibold text-text-soft">Chưa có lịch đăng</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
