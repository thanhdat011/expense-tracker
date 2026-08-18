import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import TransactionForm from "./TransactionForm";
import TransactionList from "./TransactionList";
import CategoryChart from "./CategoryChart";
import TrendChart from "./TrendChart";
import DashboardTabs from "./DashboardTabs";
import LogoutButton from "./LogoutButton";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  const { data: transactions } = await supabase
    .from("transactions")
    .select("*, categories(name)")
    .order("txn_date", { ascending: false });

  const totalIncome =
    transactions
      ?.filter((t) => t.type === "income")
      .reduce((sum, t) => sum + Number(t.amount), 0) ?? 0;

  const totalExpense =
    transactions
      ?.filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount), 0) ?? 0;
  const categoryChartData = Object.values(
    (transactions ?? [])
      .filter((t) => t.type === "expense")
      .reduce((acc: Record<string, { name: string; value: number }>, t) => {
        const name = t.categories?.name ?? "Khác";
        if (!acc[name]) acc[name] = { name, value: 0 };
        acc[name].value += Number(t.amount);
        return acc;
      }, {}),
  );

  // Dữ liệu cho biểu đồ cột: thu/chi theo tháng (6 tháng gần nhất)
  const trendMap: Record<string, { income: number; expense: number }> = {};
  (transactions ?? []).forEach((t) => {
    const month = new Date(t.txn_date).toLocaleDateString("vi-VN", {
      month: "2-digit",
      year: "numeric",
    });
    if (!trendMap[month]) trendMap[month] = { income: 0, expense: 0 };
    trendMap[month][t.type as "income" | "expense"] += Number(t.amount);
  });
  const trendChartData = Object.entries(trendMap)
    .map(([month, v]) => ({ month, ...v }))
    .slice(-6);
  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <div
        className="rounded-sm p-5"
        style={{ backgroundColor: "var(--color-brand)" }}
      >
        <p className="text-xs tracking-widest text-[#C9D9C4] uppercase">
          Sổ Thu Chi
        </p>
        <div className="flex items-center justify-between">
          <h1 className="font-display text-xl text-[#EFEAD9]">{user.email}</h1>
          <div className="flex gap-3">
            <Link
              href="/dashboard/categories"
              className="text-sm text-[#C9D9C4] underline"
            >
              Danh mục
            </Link>
            <LogoutButton />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="card">
          <p className="text-xs text-[#8A8367]">Thu</p>
          <p
            className="font-mono font-semibold"
            style={{ color: "var(--color-income)" }}
          >
            {totalIncome.toLocaleString("vi-VN")}đ
          </p>
        </div>
        <div className="card">
          <p className="text-xs text-[#8A8367]">Chi</p>
          <p
            className="font-mono font-semibold"
            style={{ color: "var(--color-expense)" }}
          >
            {totalExpense.toLocaleString("vi-VN")}đ
          </p>
        </div>
        <div className="card">
          <p className="text-xs text-[#8A8367]">Số dư</p>
          <p className="font-mono font-semibold">
            {(totalIncome - totalExpense).toLocaleString("vi-VN")}đ
          </p>
        </div>
      </div>

      <DashboardTabs
        transactionsContent={
          <div className="space-y-6">
            <TransactionForm categories={categories ?? []} />
            <div>
              <h2 className="font-display mb-2 font-semibold">
                Lịch sử giao dịch
              </h2>
              <TransactionList transactions={transactions ?? []} />
            </div>
          </div>
        }
        statsContent={
          <div className="space-y-6">
            <TrendChart data={trendChartData} />
            <CategoryChart data={categoryChartData} />
          </div>
        }
      />
    </div>
  );
}
