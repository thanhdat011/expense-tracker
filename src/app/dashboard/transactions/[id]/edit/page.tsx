import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import EditTransactionForm from "./EditTransactionForm";

export default async function EditTransactionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: transaction } = await supabase
    .from("transactions")
    .select("*")
    .eq("id", id)
    .single();

  if (!transaction) notFound();

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name");
  const { data: accounts } = await supabase
    .from("accounts")
    .select("id, name")
    .order("created_at");
  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <h1 className="font-display text-xl font-semibold">Sửa giao dịch</h1>
      <EditTransactionForm
        transaction={transaction}
        categories={categories ?? []}
        accounts={accounts ?? []}
      />
    </div>
  );
}
