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

interface JobStatsChartProps {
  data: Array<{
    type: string;
    count: number;
  }>;
}

export function JobStatsChart({ data }: JobStatsChartProps) {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Jobs by Type</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="type" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#f97316" name="Jobs" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
