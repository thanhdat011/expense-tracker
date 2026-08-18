"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addCategory(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Chưa đăng nhập");

  const name = formData.get("name") as string;
  const type = formData.get("type") as string;

  const { error } = await supabase.from("categories").insert({
    user_id: user.id,
    name,
    type,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/categories");
  revalidatePath("/dashboard");
}

export async function deleteCategory(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/categories");
  revalidatePath("/dashboard");
}
