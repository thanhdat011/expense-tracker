"use client";

import { deleteCategory } from "./actions";

type Category = { id: string; name: string; type: string };

export default function CategoryList({
  categories,
}: {
  categories: Category[];
}) {
  async function handleDelete(id: string) {
    if (
      !confirm("Xóa danh mục này? Các giao dịch cũ sẽ không còn gắn danh mục.")
    )
      return;
    try {
      await deleteCategory(id);
    } catch (e) {
      alert("Không xóa được: " + (e as Error).message);
    }
  }

  const income = categories.filter((c) => c.type === "income");
  const expense = categories.filter((c) => c.type === "expense");

  return (
    <div className="space-y-4">
      <div className="card">
        <h3
          className="mb-2 text-sm font-semibold"
          style={{ color: "var(--color-income)" }}
        >
          Danh mục Thu
        </h3>
        {income.length === 0 && (
          <p className="text-sm text-[#8A8367]">Chưa có danh mục thu.</p>
        )}
        {income.map((c) => (
          <div key={c.id} className="ledger-row">
            <p>{c.name}</p>
            <button
              onClick={() => handleDelete(c.id)}
              className="text-xs text-[#8A8367] underline hover:text-[#B3452A]"
            >
              Xóa
            </button>
          </div>
        ))}
      </div>

      <div className="card">
        <h3
          className="mb-2 text-sm font-semibold"
          style={{ color: "var(--color-expense)" }}
        >
          Danh mục Chi
        </h3>
        {expense.length === 0 && (
          <p className="text-sm text-[#8A8367]">Chưa có danh mục chi.</p>
        )}
        {expense.map((c) => (
          <div key={c.id} className="ledger-row">
            <p>{c.name}</p>
            <button
              onClick={() => handleDelete(c.id)}
              className="text-xs text-[#8A8367] underline hover:text-[#B3452A]"
            >
              Xóa
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
