"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addAccount(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Chưa đăng nhập");

  const { error } = await supabase.from("accounts").insert({
    user_id: user.id,
    name: formData.get("name") as string,
    type: formData.get("type") as string,
    initial_balance: parseFloat(
      (formData.get("initial_balance") as string) || "0",
    ),
  });

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/accounts");
  revalidatePath("/dashboard");
}

export async function deleteAccount(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("accounts").delete().eq("id", id);

  if (error) {
    throw new Error("Không xóa được: ví này còn giao dịch gắn với nó");
  }
  revalidatePath("/dashboard/accounts");
  revalidatePath("/dashboard");
}
