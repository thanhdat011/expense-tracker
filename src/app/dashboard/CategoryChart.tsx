"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

type ChartData = {
  name: string;
  value: number;
};

const COLORS = [
  "#2F5233",
  "#B3452A",
  "#8A8367",
  "#C99A3D",
  "#4A6B8A",
  "#7A4A6B",
];

export default function CategoryChart({ data }: { data: ChartData[] }) {
  if (data.length === 0) {
    return (
      <p className="text-sm text-[#8A8367]">
        Chưa có dữ liệu chi tiêu để vẽ biểu đồ.
      </p>
    );
  }

  return (
    <div className="card">
      <h2 className="font-display mb-3 font-semibold">
        Chi tiêu theo danh mục
      </h2>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={90}
            label={(entry) => `${entry.name}`}
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => `${value.toLocaleString("vi-VN")}đ`}
            contentStyle={{ fontFamily: "var(--font-body)", fontSize: 13 }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
