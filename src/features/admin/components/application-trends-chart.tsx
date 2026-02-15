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

interface ApplicationTrendsChartProps {
  data: Array<{
    date: string;
    status: string;
    count: number;
  }>;
}

export function ApplicationTrendsChart({ data }: ApplicationTrendsChartProps) {
  // Transform data for recharts
  const chartData = data.reduce((acc: any[], item) => {
    const existing = acc.find((d) => d.date === item.date);
    if (existing) {
      existing[item.status] = item.count;
    } else {
      acc.push({
        date: item.date,
        [item.status]: item.count,
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
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Application Trends (Last 60 Days)</CardTitle>
      </CardHeader>
      <CardContent className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="pending"
              stroke="#eab308"
              name="Pending"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="reviewing"
              stroke="#3b82f6"
              name="Reviewing"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="accepted"
              stroke="#10b981"
              name="Accepted"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="rejected"
              stroke="#ef4444"
              name="Rejected"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
