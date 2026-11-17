import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import TransactionForm from "./TransactionForm";
import TransactionList from "./TransactionList";
import CategoryChart from "./CategoryChart";
import TrendChart from "./TrendChart";
import DashboardTabs from "./DashboardTabs";
import LogoutButton from "./LogoutButton";
import { formatMoneyShort, formatMoneyFull } from "@/lib/format";

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
    .select("*, categories(name), accounts(name)")
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

  const { data: accounts } = await supabase
    .from("accounts")
    .select("*")
    .order("created_at");

  const accountBalances = (accounts ?? []).map((a) => {
    const income = (transactions ?? [])
      .filter((t) => t.account_id === a.id && t.type === "income")
      .reduce((s, t) => s + Number(t.amount), 0);
    const expense = (transactions ?? [])
      .filter((t) => t.account_id === a.id && t.type === "expense")
      .reduce((s, t) => s + Number(t.amount), 0);
    return { ...a, balance: Number(a.initial_balance) + income - expense };
  });
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
          <h1 className="font-display text-xl text-[#EFEAD9]  min-w-0 truncate">
            {user.email}
          </h1>
          <div className="flex gap-3 shrink-0 whitespace-nowrap">
            <Link
              href="/dashboard/accounts"
              className="text-sm text-[#C9D9C4] underline"
            >
              Ví
            </Link>
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
            className="font-mono text-sm font-semibold break-words sm:text-base"
            style={{ color: "var(--color-income)" }}
            title={formatMoneyFull(totalIncome)}
          >
            {formatMoneyShort(totalIncome)}
          </p>
        </div>
        <div className="card min-w-0">
          <p className="text-xs text-[#8A8367]">Chi</p>
          <p
            className="font-mono text-sm font-semibold break-words sm:text-base"
            style={{ color: "var(--color-expense)" }}
            title={formatMoneyFull(totalExpense)}
          >
            {formatMoneyShort(totalExpense)}
          </p>
        </div>
        <div className="card">
          <p className="text-xs text-[#8A8367]">Số dư</p>
          <p
            className="font-mono text-sm font-semibold break-words sm:text-base"
            title={formatMoneyFull(totalIncome - totalExpense)}
          >
            {formatMoneyShort(totalIncome - totalExpense)}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 text-center">
        {accountBalances.map((a) => (
          <div key={a.id} className="card min-w-0">
            <p className="truncate text-xs text-[#8A8367]">{a.name}</p>
            <p
              className="font-mono text-sm font-semibold"
              title={formatMoneyFull(a.balance)}
            >
              {formatMoneyShort(a.balance)}
            </p>
          </div>
        ))}
      </div>

      <DashboardTabs
        transactionsContent={
          <div className="space-y-6">
            <TransactionForm
              categories={categories ?? []}
              accounts={accounts ?? []}
            />
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
