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
      completed: data.leads.filter((lead) => lead.status.toLowerCase().includes("báo") || lead.status.toLowerCase().includes("deal")).length,
      pending: data.leads.filter((lead) => lead.status.toLowerCase().includes("lead") || lead.status.toLowerCase().includes("tư")).length,
      quality: data.leads.length ? Math.round(((data.leads.length - overdueTasks) / data.leads.length) * 100) : 0
    }
  ];

  const timelineData = [
    { name: "Ngày", tasks: getTodayTasks(data.tasks).length, leads: data.leads.length, content: data.contentPosts.length },
    { name: "Tháng", tasks: totalTasks, leads: data.leads.length * 8, content: data.contentPosts.length * 6 },
    { name: "Quý", tasks: totalTasks * 3, leads: data.leads.length * 24, content: data.contentPosts.length * 18 }
  ];

  const completionData = [
    { name: "Hoàn thành", value: doneTasks },
    { name: "Đang xử lý", value: Math.max(totalTasks - doneTasks - overdueTasks, 0) },
    { name: "Trễ hạn", value: overdueTasks }
  ];

  const employeeData = [
    { name: "Digital", score: data.adsReports.length ? Math.max(55, 100 - data.adsReports.filter((ad) => ad.status === "Learning").length * 12) : 0 },
    { name: "Content", score: data.approvalItems.length ? Math.max(50, 100 - pendingApproval * 10) : 0 },
    { name: "Sale", score: data.leads.length ? Math.min(100, data.leads.length * 22) : 0 },
    { name: "Task", score: completionRate(doneTasks, totalTasks) }
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4"><p className="text-sm font-semibold text-text-muted">Nội dung chờ duyệt</p><p className="mt-2 text-3xl font-bold">{pendingApproval}</p></Card>
        <Card className="p-4"><p className="text-sm font-semibold text-text-muted">Lead trong pipeline</p><p className="mt-2 text-3xl font-bold">{data.leads.length}</p></Card>
        <Card className="p-4"><p className="text-sm font-semibold text-text-muted">Campaign/Ads đang chạy</p><p className="mt-2 text-3xl font-bold">{data.campaignEvents.length + data.adsReports.length}</p></Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.75fr]">
        <Card>
          <h2 className="text-lg font-bold text-text-main">Tổng quan ngày, tháng, quý</h2>
          <p className="mt-1 text-sm text-text-muted">Biểu đồ cột so sánh khối lượng task, lead và content theo chu kỳ.</p>
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
          <h2 className="text-lg font-bold text-text-main">Trạng thái công việc</h2>
          <p className="mt-1 text-sm text-text-muted">Biểu đồ tròn thể hiện tỷ lệ việc đã xong, đang xử lý và trễ hạn.</p>
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
          <h2 className="text-lg font-bold text-text-main">Chất lượng theo phòng ban</h2>
          <p className="mt-1 text-sm text-text-muted">So sánh việc hoàn thành, tồn đọng và điểm chất lượng tổng hợp.</p>
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
          <h2 className="text-lg font-bold text-text-main">Điểm hiệu suất cá nhân/nhóm</h2>
          <p className="mt-1 text-sm text-text-muted">Biểu đồ đường giúp nhận ra nhóm cần hỗ trợ thêm.</p>
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
