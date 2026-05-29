import { ContentCard } from "./ContentCard";
import { contentPosts } from "@/lib/mock-data";

const days = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "CN"];

export function ContentCalendar() {
  return (
    <div className="grid gap-4 lg:grid-cols-7">
      {days.map((day, index) => (
        <div key={day} className="min-h-48 rounded-card border border-border bg-white p-4 shadow-card">
          <p className="mb-3 text-sm font-bold text-text-main">{day}</p>
          <div className="space-y-3">
            {contentPosts.filter((_, postIndex) => postIndex % 7 === index % 4).map((post) => (
              <div key={post.id} className="rounded-2xl bg-surface-soft p-3">
                <p className="text-xs font-bold text-primary">{post.channel}</p>
                <p className="mt-1 text-sm font-semibold text-text-main">{post.title}</p>
                <p className="mt-1 text-xs text-text-muted">{post.scheduledAt}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
