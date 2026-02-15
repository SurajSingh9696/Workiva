"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface TopEmployersChartProps {
  data: Array<{
    name: string;
    jobCount: number;
  }>;
}

export function TopEmployersChart({ data }: TopEmployersChartProps) {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Top 10 Employers by Job Posts</CardTitle>
      </CardHeader>
      <CardContent className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={150} />
            <Tooltip />
            <Legend />
            <Bar dataKey="jobCount" fill="#8b5cf6" name="Job Posts" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
