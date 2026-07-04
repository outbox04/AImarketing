"use client";

import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "@/components/ui/Card";
import { getDoneTasks, getOverdueTasks, getPendingApproval, getTodayTasks } from "@/lib/rules/marketing-rules";
import type { MarketingData } from "@/lib/data/marketing-data";

const colors = ["#4F46E5", "#22C55E", "#F59E0B", "#0EA5E9", "#EF4444", "#8B5CF6"];

function completionRate(done: number, total: number) {
  return total === 0 ? 0 : Math.round((done / total) * 100);
}

export function LeadershipDashboard({ data }: { data: MarketingData }) {
  const doneTasks = getDoneTasks(data.tasks).length;
  const totalTasks = data.tasks.length;
  const overdueTasks = getOverdueTasks(data.tasks).length;
  const pendingApproval = getPendingApproval(data.approvalItems).length;

  const departmentData = [
    {
      name: "Marketing",
      completed: doneTasks,
      pending: pendingApproval + data.contentPosts.filter((item) => item.status === "PENDING" || item.status === "REVISION").length,
      quality: Math.max(0, 100 - pendingApproval * 8)
    },
    {
      name: "Sale",
      completed: data.leads.filter((lead) => lead.status.toLowerCase().includes("bao") || lead.status.toLowerCase().includes("deal")).length,
      pending: data.leads.filter((lead) => lead.status.toLowerCase().includes("lead") || lead.status.toLowerCase().includes("tu")).length,
      quality: data.leads.length ? Math.round((data.leads.length - overdueTasks) / data.leads.length * 100) : 0
    }
  ];

  const timelineData = [
    { name: "Ngay", tasks: getTodayTasks(data.tasks).length, leads: data.leads.length, content: data.contentPosts.length },
    { name: "Thang", tasks: totalTasks, leads: data.leads.length * 8, content: data.contentPosts.length * 6 },
    { name: "Quy", tasks: totalTasks * 3, leads: data.leads.length * 24, content: data.contentPosts.length * 18 }
  ];

  const completionData = [
    { name: "Hoan thanh", value: doneTasks },
    { name: "Dang xu ly", value: Math.max(totalTasks - doneTasks - overdueTasks, 0) },
    { name: "Tre han", value: overdueTasks }
  ];

  const employeeData = [
    { name: "Digital", score: data.adsReports.length ? Math.max(55, 100 - data.adsReports.filter((ad) => ad.status === "Learning").length * 12) : 0 },
    { name: "Content", score: data.approvalItems.length ? Math.max(50, 100 - pendingApproval * 10) : 0 },
    { name: "Sale", score: data.leads.length ? Math.min(100, data.leads.length * 22) : 0 },
    { name: "Task", score: completionRate(doneTasks, totalTasks) }
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="p-4"><p className="text-sm font-semibold text-text-muted">Hoan thanh cong viec</p><p className="mt-2 text-3xl font-bold">{completionRate(doneTasks, totalTasks)}%</p></Card>
        <Card className="p-4"><p className="text-sm font-semibold text-text-muted">Can duyet</p><p className="mt-2 text-3xl font-bold">{pendingApproval}</p></Card>
        <Card className="p-4"><p className="text-sm font-semibold text-text-muted">Lead trong pipeline</p><p className="mt-2 text-3xl font-bold">{data.leads.length}</p></Card>
        <Card className="p-4"><p className="text-sm font-semibold text-text-muted">Campaign/Ads dang chay</p><p className="mt-2 text-3xl font-bold">{data.campaignEvents.length + data.adsReports.length}</p></Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.75fr]">
        <Card>
          <h2 className="text-lg font-bold text-text-main">Tong quan ngay, thang, quy</h2>
          <p className="mt-1 text-sm text-text-muted">Bieu do cot so sanh khoi luong task, lead va content theo chu ky.</p>
          <div className="mt-5 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timelineData}>
                <CartesianGrid stroke="#E5E7EB" strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip />
                <Bar dataKey="tasks" fill="#4F46E5" radius={[6, 6, 0, 0]} />
                <Bar dataKey="leads" fill="#22C55E" radius={[6, 6, 0, 0]} />
                <Bar dataKey="content" fill="#0EA5E9" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-bold text-text-main">Trang thai hoan thanh</h2>
          <p className="mt-1 text-sm text-text-muted">Bieu do tron giup nhin nhanh ty le viec da xong, dang xu ly va tre han.</p>
          <div className="mt-5 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={completionData} dataKey="value" nameKey="name" innerRadius={58} outerRadius={110} paddingAngle={4}>
                  {completionData.map((entry, index) => (
                    <Cell key={entry.name} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <h2 className="text-lg font-bold text-text-main">Chat luong theo phong ban</h2>
          <p className="mt-1 text-sm text-text-muted">So sanh viec hoan thanh, ton dong va diem chat luong tong hop.</p>
          <div className="mt-5 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentData}>
                <CartesianGrid stroke="#E5E7EB" strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip />
                <Bar dataKey="completed" fill="#22C55E" radius={[6, 6, 0, 0]} />
                <Bar dataKey="pending" fill="#F59E0B" radius={[6, 6, 0, 0]} />
                <Bar dataKey="quality" fill="#4F46E5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-bold text-text-main">Diem hieu suat ca nhan/nhom</h2>
          <p className="mt-1 text-sm text-text-muted">Bieu do duong de nhan ra nhom can ho tro them.</p>
          <div className="mt-5 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={employeeData}>
                <CartesianGrid stroke="#E5E7EB" strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} domain={[0, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#4F46E5" strokeWidth={3} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
