"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface RevenueChartProps {
  data: {
    month: string;
    revenue: number;
  }[];
}

const RevenueChart = ({ data }: RevenueChartProps) => {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
        >
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6d28d9" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#6d28d9" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            stroke="#e4e4e7"
            strokeDasharray="4 4"
            vertical={false}
          />

          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#71717a", fontSize: 12 }}
            tickMargin={12}
          />

          <YAxis
            tickFormatter={(value: number) =>
              `Rs. ${value.toLocaleString("en-IN")}`
            }
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#71717a", fontSize: 11 }}
            width={90}
            tickMargin={8}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              border: "1px solid #e4e4e7",
              borderRadius: "0",
              padding: "10px 14px",
              fontSize: "13px",
            }}
            labelStyle={{
              color: "#18181b",
              fontWeight: 600,
              marginBottom: "4px",
            }}
            itemStyle={{ color: "#6d28d9", fontWeight: 600 }}
            formatter={(value) => [
              `Rs. ${Number(value).toLocaleString("en-IN")}`,
              "Revenue",
            ]}
          />

          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#6d28d9"
            strokeWidth={2.5}
            fill="url(#revenueGradient)"
            activeDot={{
              r: 5,
              fill: "#6d28d9",
              stroke: "#ffffff",
              strokeWidth: 2,
            }}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;
