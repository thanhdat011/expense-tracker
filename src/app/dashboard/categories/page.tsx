import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import CategoryForm from "./CategoryForm";
import CategoryList from "./CategoryList";

export default async function CategoriesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-xl font-semibold">Quản lý danh mục</h1>
        <Link href="/dashboard" className="text-sm underline">
          ← Quay lại
        </Link>
      </div>

      <CategoryForm />
      <CategoryList categories={categories ?? []} />
    </div>
  );
}

