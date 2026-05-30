import { GoogleModuleWorkspace } from "@/components/google/GoogleModuleWorkspace";
import { modulePageConfigs } from "@/lib/google/page-configs";

export const dynamic = "force-dynamic";

export default function LeadsReportsPage() {
  return <GoogleModuleWorkspace {...modulePageConfigs.leadsReports} />;
}
