import { Clapperboard } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";

const videos = [
  { title: "Recap automation customer", channel: "YouTube Shorts", shoot: "30/05", publish: "02/06", status: "Subtitle" },
  { title: "Founder talk: AI Marketing Ops", channel: "Facebook", shoot: "31/05", publish: "04/06", status: "Script" },
  { title: "Workshop teaser", channel: "Ads", shoot: "01/06", publish: "05/06", status: "Chờ duyệt" }
];

export default function VideoPage() {
  return (
    <div className="mx-auto max-w-[1300px]">
      <PageHeader
        eyebrow="Video Pipeline"
        title="Video"
        description="Theo dõi từ idea, script, quay, dựng, subtitle, chờ duyệt đến đã đăng."
        actions={<Button variant="primary"><Clapperboard size={17} /> Thêm video</Button>}
      />
      <div className="grid gap-5 lg:grid-cols-3">
        {videos.map((video) => (
          <Card key={video.title}>
            <div className="mb-4 aspect-video rounded-2xl border border-border bg-[url('/media/content/video-preview.svg')] bg-cover bg-center" />
            <h3 className="text-lg font-bold text-text-main">{video.title}</h3>
            <p className="mt-2 text-sm text-text-muted">{video.channel}</p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-2xl bg-surface-soft p-3"><p className="text-text-soft">Ngày quay</p><p className="font-bold">{video.shoot}</p></div>
              <div className="rounded-2xl bg-surface-soft p-3"><p className="text-text-soft">Ngày đăng</p><p className="font-bold">{video.publish}</p></div>
            </div>
            <p className="mt-4 rounded-full bg-warning-soft px-3 py-1 text-xs font-bold text-amber-700">{video.status}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
