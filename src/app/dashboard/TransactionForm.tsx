"use client";

import { useState } from "react";
import { addTransaction } from "./actions";

type Category = {
  id: string;
  name: string;
  type: string;
};
type Account = { id: string; name: string };

function formatNumber(value: string) {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "";
  return Number(digits).toLocaleString("en-US");
}

export default function TransactionForm({
  categories,
  accounts,
}: {
  categories: Category[];
  accounts: Account[];
}) {
  const [type, setType] = useState("expense");
  const [amountDisplay, setAmountDisplay] = useState("");
  const [loading, setLoading] = useState(false);

  const filteredCategories = categories.filter((c) => c.type === type);
  const rawAmount = amountDisplay.replace(/,/g, "");

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    await addTransaction(formData);
    setLoading(false);
    setAmountDisplay("");
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
        type="text"
        inputMode="numeric"
        placeholder="Số tiền"
        value={amountDisplay}
        onChange={(e) => setAmountDisplay(formatNumber(e.target.value))}
        required
        className="input font-mono"
      />
      <input type="hidden" name="amount" value={rawAmount} />

      <select name="account_id" required className="input">
        {accounts.map((a) => (
          <option key={a.id} value={a.id}>
            {a.name}
          </option>
        ))}
      </select>

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
