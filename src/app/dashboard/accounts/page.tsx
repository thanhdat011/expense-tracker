import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import AccountManager from "./AccountManager";

export default async function AccountsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: accounts } = await supabase
    .from("accounts")
    .select("*")
    .order("created_at");

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-xl font-semibold">Quản lý ví</h1>
        <Link href="/dashboard" className="text-sm underline">
          ← Quay lại
        </Link>
      </div>
      <AccountManager accounts={accounts ?? []} />
    </div>
  );
}
