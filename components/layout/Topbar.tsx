import { Bell, Command, Search, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function Topbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/85 px-4 py-3 backdrop-blur xl:ml-72 xl:px-8">
      <div className="flex items-center gap-3">
        <div className="relative hidden flex-1 md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-soft" size={18} />
          <Input className="pl-10" placeholder="Tìm task, nội dung, campaign, lead..." />
        </div>
        <div className="hidden items-center gap-2 rounded-2xl border border-border bg-white px-3 py-2 text-sm font-semibold text-text-muted lg:flex">
          <ShieldCheck size={17} className="text-success" />
          Hôm nay: 14 việc, 6 chờ duyệt
        </div>
        <Button variant="secondary" size="sm" aria-label="Mở command menu">
          <Command size={17} />
        </Button>
        <Button variant="secondary" size="sm" aria-label="Thông báo">
          <Bell size={17} />
        </Button>
      </div>
    </header>
  );
}
