import { ArrowRight, CalendarClock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ownerName } from "@/lib/constants";

export function MorningDigest() {
  return (
    <section className="overflow-hidden rounded-[28px] border border-indigo-100 bg-gradient-to-br from-white via-[#F8FAFF] to-[#EEF2FF] p-6 shadow-soft md:p-8">
      <div className="grid gap-6 lg:grid-cols-[1.5fr_0.8fr] lg:items-center">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-3 py-1.5 text-sm font-semibold text-primary">
            <CalendarClock size={16} />
            Morning Digest
          </div>
          <h1 className="text-3xl font-bold tracking-normal text-text-main md:text-4xl">Chào buổi sáng, {ownerName}.</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-text-muted">
            Hôm nay có <strong className="text-text-main">14 việc cần xử lý</strong>,{" "}
            <strong className="text-text-main">6 nội dung cần duyệt</strong>,{" "}
            <strong className="text-danger">3 deadline nguy hiểm</strong> và{" "}
            <strong className="text-text-main">1 event cần cập nhật proposal</strong>.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button variant="primary">
              Duyệt nội dung <ArrowRight size={17} />
            </Button>
            <Button variant="secondary">Xem timeline hôm nay</Button>
          </div>
        </div>
        <div className="rounded-3xl border border-white/70 bg-white/75 p-4 shadow-card">
          {["Proposal event cần xong trước 11:00", "Website thiếu ảnh đại diện", "Ads CPL tăng 14%"].map((item) => (
            <div key={item} className="flex items-center gap-3 border-b border-border py-3 last:border-0">
              <div className="grid h-9 w-9 place-items-center rounded-2xl bg-primary-soft text-primary">
                <CheckCircle2 size={18} />
              </div>
              <p className="text-sm font-semibold text-text-main">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
