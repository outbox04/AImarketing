"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "@/components/ui/Card";

type ChartPoint = {
  name: string;
  leads: number;
  content: number;
};

export function ChartBlock({ chartData }: { chartData: ChartPoint[] }) {
  return (
    <Card>
      <h2 className="text-lg font-bold text-text-main">Hiệu suất tuần</h2>
      <p className="mt-1 text-sm text-text-muted">Lead và nhịp xuất bản nội dung theo ngày.</p>
      <div className="mt-5 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="leads" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#E5E7EB" strokeDasharray="3 3" />
            <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
            <YAxis stroke="#9CA3AF" fontSize={12} />
            <Tooltip />
            <Area type="monotone" dataKey="leads" stroke="#4F46E5" fill="url(#leads)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
