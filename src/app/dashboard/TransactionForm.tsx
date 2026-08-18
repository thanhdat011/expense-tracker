"use client";

import { useState } from "react";
import { addTransaction } from "./actions";

type Category = {
  id: string;
  name: string;
  type: string;
};

export default function TransactionForm({
  categories,
}: {
  categories: Category[];
}) {
  const [type, setType] = useState("expense");
  const [loading, setLoading] = useState(false);

  const filteredCategories = categories.filter((c) => c.type === type);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    await addTransaction(formData);
    setLoading(false);
    (document.getElementById("txn-form") as HTMLFormElement)?.reset();
  }

  return (
    <form id="txn-form" action={handleSubmit} className="card space-y-3">
      <h2 className="font-display text-lg font-semibold">Thêm giao dịch</h2>

      <div className="flex gap-4 text-sm">
        <label className="flex items-center gap-1.5">
          <input
            type="radio"
            name="type"
            value="expense"
            checked={type === "expense"}
            onChange={() => setType("expense")}
            className="accent-[#B3452A]"
          />
          Chi
        </label>
        <label className="flex items-center gap-1.5">
          <input
            type="radio"
            name="type"
            value="income"
            checked={type === "income"}
            onChange={() => setType("income")}
            className="accent-[#2F6B4F]"
          />
          Thu
        </label>
      </div>

      <input
        type="number"
        name="amount"
        placeholder="Số tiền"
        required
        min="0"
        step="1000"
        className="input font-mono"
      />

      <select name="category_id" className="input">
        <option value="">-- Chọn danh mục --</option>
        {filteredCategories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      <input
        type="date"
        name="txn_date"
        required
        defaultValue={new Date().toISOString().split("T")[0]}
        className="input"
      />

      <input
        type="text"
        name="note"
        placeholder="Ghi chú (tùy chọn)"
        className="input"
      />

      <button type="submit" disabled={loading} className="btn-primary">
        {loading ? "Đang lưu..." : "Lưu giao dịch"}
      </button>
    </form>
  );
}
