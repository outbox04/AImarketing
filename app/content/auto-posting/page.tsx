import { ShieldAlert } from "lucide-react";
import { ContentCard } from "@/components/content/ContentCard";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { getContentData } from "@/lib/data/marketing-data";

export const revalidate = 15;

export default async function AutoPostingPage() {
  const data = await getContentData();

  return (
    <div className="mx-auto max-w-[1200px]">
      <PageHeader
        eyebrow="Publishing Guardrail"
        title="Auto Posting"
        description="Danh sách nội dung đủ điều kiện tự động đăng. Rule chính: chỉ auto post khi status là APPROVED."
      />
      <Card className="mb-5 flex gap-3 bg-warning-soft">
        <ShieldAlert className="shrink-0 text-warning" />
        <p className="text-sm font-semibold leading-6 text-amber-800">Frontend không gọi Facebook/Google trực tiếp. Tất cả lệnh publish phải đi qua API route server-side.</p>
      </Card>
      <div className="grid gap-4 lg:grid-cols-2">
        {data.contentPosts.map((post) => <ContentCard key={post.id} post={post} />)}
      </div>
    </div>
  );
}
