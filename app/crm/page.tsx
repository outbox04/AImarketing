import { Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { getLeadData } from "@/lib/data/marketing-data";

export const dynamic = "force-dynamic";

export default async function CrmPage() {
  const data = await getLeadData();

  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        eyebrow="Customer Data"
        title="CRM / Customer Data"
        description="Pipeline lead mới, đã liên hệ, đang tư vấn, báo giá, chốt deal, chăm sóc lại với ngày follow rõ ràng."
        actions={<Button variant="primary" disabled title="Thêm lead cần Google Sheets write integration"><Users size={17} /> Thêm lead</Button>}
      />
      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="bg-surface-soft text-xs uppercase text-text-soft">
              <tr><th className="px-5 py-4">Khách hàng</th><th className="px-5 py-4">SĐT</th><th className="px-5 py-4">Email</th><th className="px-5 py-4">Nguồn</th><th className="px-5 py-4">Nhu cầu</th><th className="px-5 py-4">Trạng thái</th><th className="px-5 py-4">Follow</th></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data.leads.map((lead) => (
                <tr key={lead.id}>
                  <td className="px-5 py-4"><p className="font-bold text-text-main">{lead.name}</p><p className="text-xs text-text-muted">{lead.note}</p></td>
                  <td className="px-5 py-4 text-text-muted">{lead.phone}</td>
                  <td className="px-5 py-4 text-text-muted">{lead.email}</td>
                  <td className="px-5 py-4 text-text-muted">{lead.source}</td>
                  <td className="px-5 py-4 text-text-muted">{lead.need}</td>
                  <td className="px-5 py-4"><span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-bold text-primary">{lead.status}</span></td>
                  <td className="px-5 py-4 font-semibold text-warning">{lead.followDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
