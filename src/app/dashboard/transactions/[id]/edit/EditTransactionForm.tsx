"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateTransaction } from "../../../actions";

type Category = { id: string; name: string; type: string };
type Account = { id: string; name: string };
type Transaction = {
  id: string;
  amount: number;
  type: string;
  category_id: string | null;
  txn_date: string;
  note: string | null;
  account_id: string | null;
};
function formatNumber(value: string) {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "";
  return Number(digits).toLocaleString("en-US");
}

export default function EditTransactionForm({
  transaction,
  categories,
  accounts,
}: {
  transaction: Transaction;
  categories: Category[];
  accounts: Account[];
}) {
  const [type, setType] = useState(transaction.type);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const filteredCategories = categories.filter((c) => c.type === type);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    await updateTransaction(transaction.id, formData);
    router.push("/dashboard");
  }
  const [amountDisplay, setAmountDisplay] = useState(
    Number(transaction.amount).toLocaleString("en-US"),
  );
  const rawAmount = amountDisplay.replace(/,/g, "");

  return (
    <form action={handleSubmit} className="card space-y-3">
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
        value={amountDisplay}
        onChange={(e) => setAmountDisplay(formatNumber(e.target.value))}
        required
        className="input font-mono"
      />
      <input type="hidden" name="amount" value={rawAmount} />

      <select
        name="account_id"
        defaultValue={transaction.account_id ?? ""}
        required
        className="input"
      >
        {accounts.map((a) => (
          <option key={a.id} value={a.id}>
            {a.name}
          </option>
        ))}
      </select>

      <select
        name="category_id"
        defaultValue={transaction.category_id ?? ""}
        className="input"
      >
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
        defaultValue={transaction.txn_date}
        required
        className="input"
      />

      <input
        type="text"
        name="note"
        defaultValue={transaction.note ?? ""}
        placeholder="Ghi chú (tùy chọn)"
        className="input"
      />

      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="text-sm underline"
        >
          Hủy
        </button>
      </div>
    </form>
  );
}
