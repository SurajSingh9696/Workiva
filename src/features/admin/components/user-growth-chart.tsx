"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface UserGrowthChartProps {
  data: Array<{
    date: string;
    role: string;
    count: number;
  }>;
}

export function UserGrowthChart({ data }: UserGrowthChartProps) {
  // Transform data for recharts
  const chartData = data.reduce((acc: any[], item) => {
    const existing = acc.find((d) => d.date === item.date);
    if (existing) {
      existing[item.role] = item.count;
    } else {
      acc.push({
        date: item.date,
        [item.role]: item.count,
      });
    }
    return acc;
  }, []);

  // Format date for display
  const formattedData = chartData.map((item) => ({
    ...item,
    date: new Date(item.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
  }));

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>User Growth (Last 30 Days)</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="applicant"
              stroke="#10b981"
              name="Applicants"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="employer"
              stroke="#8b5cf6"
              name="Employers"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="admin"
              stroke="#3b82f6"
              name="Admins"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
