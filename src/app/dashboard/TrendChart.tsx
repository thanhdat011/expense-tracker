"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type TrendData = {
  month: string;
  income: number;
  expense: number;
};

export default function TrendChart({ data }: { data: TrendData[] }) {
  if (data.length === 0) {
    return null;
  }

  return (
    <div className="card">
      <h2 className="font-display mb-3 font-semibold">Thu chi theo tháng</h2>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#D8D1B8" />
          <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#5C5940" }} />
          <YAxis tick={{ fontSize: 12, fill: "#5C5940" }} />
          <Tooltip
            formatter={(value) => `${Number(value).toLocaleString("vi-VN")}đ`}
          />
          <Bar
            dataKey="income"
            fill="#2F6B4F"
            name="Thu"
            radius={[3, 3, 0, 0]}
          />
          <Bar
            dataKey="expense"
            fill="#B3452A"
            name="Chi"
            radius={[3, 3, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
