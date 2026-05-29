import { Megaphone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { adsReports } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

export default function AdsPage() {
  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        eyebrow="Performance"
        title="Ads Management"
        description="Theo dõi campaign, platform, budget, spend, lead, CPL, CTR và report link để xử lý nhanh điểm bất thường."
        actions={<Button variant="primary"><Megaphone size={17} /> Tạo campaign</Button>}
      />
      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="bg-surface-soft text-xs uppercase text-text-soft">
              <tr><th className="px-5 py-4">Campaign</th><th className="px-5 py-4">Platform</th><th className="px-5 py-4">Budget</th><th className="px-5 py-4">Spend</th><th className="px-5 py-4">Lead</th><th className="px-5 py-4">CPL</th><th className="px-5 py-4">CTR</th><th className="px-5 py-4">Status</th></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {adsReports.map((ad) => (
                <tr key={ad.id}>
                  <td className="px-5 py-4 font-bold text-text-main">{ad.campaignName}</td>
                  <td className="px-5 py-4 text-text-muted">{ad.platform}</td>
                  <td className="px-5 py-4 text-text-muted">{formatCurrency(ad.budget)}</td>
                  <td className="px-5 py-4 text-text-muted">{formatCurrency(ad.spend)}</td>
                  <td className="px-5 py-4 font-bold text-text-main">{ad.leads}</td>
                  <td className="px-5 py-4 text-text-muted">{formatCurrency(ad.cpl)}</td>
                  <td className="px-5 py-4 text-text-muted">{ad.ctr}</td>
                  <td className="px-5 py-4"><span className="rounded-full bg-info-soft px-3 py-1 text-xs font-bold text-sky-700">{ad.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
