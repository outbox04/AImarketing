import { KeyRound, PlugZap, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { Input } from "@/components/ui/Input";
import { maskSecret } from "@/lib/utils";

const settings = [
  "Supabase URL", "Supabase Service Role Key", "Google Drive Folder ID", "Google Calendar ID", "Telegram Bot báo cáo",
  "Telegram Bot nhập liệu", "OpenAI API", "Claude API", "Facebook Page ID", "Facebook Access Token"
];

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-[1200px]">
      <PageHeader
        eyebrow="Secure Integrations"
        title="Settings"
        description="Quản lý kết nối server-side. Token luôn được masked, test connection đi qua API route, không expose secret ra frontend."
      />
      <Card className="mb-6 flex gap-3 bg-danger-soft">
        <ShieldAlert className="shrink-0 text-danger" />
        <p className="text-sm font-semibold leading-6 text-red-700">Không nhập token thật vào component. Production dùng `.env.local` và Vercel Environment Variables.</p>
      </Card>
      <div className="grid gap-4 lg:grid-cols-2">
        {settings.map((setting, index) => (
          <Card key={setting} className="p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-primary-soft text-primary"><KeyRound size={18} /></div>
                <h3 className="font-bold text-text-main">{setting}</h3>
              </div>
              <Badge className={index < 3 ? "border-green-200 bg-success-soft text-green-700" : "border-border bg-surface-soft text-text-muted"}>
                {index < 3 ? "Connected" : "Disconnected"}
              </Badge>
            </div>
            <Input readOnly value={maskSecret(index < 3 ? "demo_server_side_value_1234" : "")} />
            <Button className="mt-3" size="sm" variant="secondary"><PlugZap size={16} /> Test connection</Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
