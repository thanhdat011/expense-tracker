"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addTransaction(formData: FormData) {
  const accountId = formData.get('account_id') as string
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Chưa đăng nhập");

  const amount = formData.get("amount") as string;
  const type = formData.get("type") as string;
  const categoryId = formData.get("category_id") as string;
  const txnDate = formData.get("txn_date") as string;
  const note = formData.get("note") as string;

  const { error } = await supabase.from("transactions").insert({
    user_id: user.id,
    account_id: accountId || null,
    amount: parseFloat(amount),
    type,
    category_id: categoryId || null,
    txn_date: txnDate,
    note: note || null,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard");
}

export async function deleteTransaction(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("transactions").delete().eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard");
}
export async function updateTransaction(id: string, formData: FormData) {
  const supabase = await createClient();
  const accountId = formData.get('account_id') as string
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Chưa đăng nhập");

  const amount = formData.get("amount") as string;
  const type = formData.get("type") as string;
  const categoryId = formData.get("category_id") as string;
  const txnDate = formData.get("txn_date") as string;
  const note = formData.get("note") as string;

  const { error } = await supabase
    .from("transactions")
    .update({
      amount: parseFloat(amount),
      account_id: accountId || null,
      type,
      category_id: categoryId || null,
      txn_date: txnDate,
      note: note || null,
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard");
}
