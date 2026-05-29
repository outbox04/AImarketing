import { PanelsTopLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";

const articles = [
  { title: "AI Marketing Operations là gì?", keyword: "ai marketing operations", slug: "/ai-marketing-operations", seo: "Cần internal link", publish: "03/06" },
  { title: "Cách chọn CRM cho SME", keyword: "chon crm cho doanh nghiep", slug: "/chon-crm-sme", seo: "OK", publish: "05/06" },
  { title: "Checklist tổ chức workshop", keyword: "to chuc workshop", slug: "/checklist-workshop", seo: "Thiếu ảnh đại diện", publish: "07/06" }
];

export default function WebsiteSeoPage() {
  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        eyebrow="Website Growth"
        title="Website & SEO"
        description="Quản lý bài website, keyword, meta, slug, trạng thái viết, trạng thái SEO và ngày publish."
        actions={<Button variant="primary"><PanelsTopLeft size={17} /> Tạo bài website</Button>}
      />
      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-surface-soft text-xs uppercase text-text-soft">
              <tr><th className="px-5 py-4">Tiêu đề</th><th className="px-5 py-4">Keyword</th><th className="px-5 py-4">Slug</th><th className="px-5 py-4">SEO</th><th className="px-5 py-4">Publish</th></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {articles.map((article) => (
                <tr key={article.slug}>
                  <td className="px-5 py-4 font-bold text-text-main">{article.title}</td>
                  <td className="px-5 py-4 text-text-muted">{article.keyword}</td>
                  <td className="px-5 py-4 text-primary">{article.slug}</td>
                  <td className="px-5 py-4 text-text-muted">{article.seo}</td>
                  <td className="px-5 py-4 text-text-muted">{article.publish}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
