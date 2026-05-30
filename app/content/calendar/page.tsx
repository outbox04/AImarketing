import { CalendarDays, Filter } from "lucide-react";
import { ContentCalendar } from "@/components/content/ContentCalendar";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { Select } from "@/components/ui/Select";
import { getContentData } from "@/lib/data/marketing-data";

export const dynamic = "force-dynamic";

export default async function ContentCalendarPage() {
  const data = await getContentData();

  return (
    <div className="mx-auto max-w-[1600px]">
      <PageHeader
        eyebrow="Publishing Plan"
        title="Content Calendar"
        description="Lịch đăng theo ngày, tuần, tháng, quý với màu pastel theo channel và filter để tránh trùng lịch."
        actions={
          <>
            <Select><option>Tuần</option><option>Ngày</option><option>Tháng</option><option>Quý</option></Select>
            <Button variant="secondary"><Filter size={17} /> Channel/status</Button>
            <Button variant="primary" disabled title="Thêm lịch đăng cần Google Sheets write integration"><CalendarDays size={17} /> Thêm lịch đăng</Button>
          </>
        }
      />
      <ContentCalendar contentPosts={data.contentPosts} />
    </div>
  );
}
