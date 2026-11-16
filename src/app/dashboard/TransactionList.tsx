"use client";

import { deleteTransaction } from "./actions";
import Link from "next/link";

type Transaction = {
  id: string;
  amount: number;
  type: string;
  txn_date: string;
  note: string | null;
  categories: { name: string } | null;
  accounts: { name: string } | null;
};

export default function TransactionList({
  transactions,
}: {
  transactions: Transaction[];
}) {
  async function handleDelete(id: string) {
    if (!confirm("Xóa giao dịch này?")) return;
    await deleteTransaction(id);
  }

  if (transactions.length === 0) {
    return (
      <p className="text-sm text-[#8A8367]">
        Chưa có giao dịch nào — thêm dòng đầu tiên phía trên.
      </p>
    );
  }

  return (
    <div className="card divide-y-0">
      {transactions.map((t) => (
        <div key={t.id} className="ledger-row">
          <div>
            <p className="text-sm text-[#5C5940]">
              {new Date(t.txn_date).toLocaleDateString("vi-VN")}
              {t.categories && ` · ${t.categories.name}`}
              {t.note && ` · ${t.note}`}
              {t.accounts && ` · ${t.accounts.name}`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <p
              className="font-mono font-semibold"
              style={{
                color:
                  t.type === "income"
                    ? "var(--color-income)"
                    : "var(--color-expense)",
              }}
            >
              {t.type === "income" ? "+" : "-"}
              {Number(t.amount).toLocaleString("vi-VN")}đ
            </p>
            <Link
              href={`/dashboard/transactions/${t.id}/edit`}
              className="text-xs underline text-[#5C5940]"
            >
              Sửa
            </Link>
            <button
              onClick={() => handleDelete(t.id)}
              className="text-xs text-[#8A8367] underline hover:text-[#B3452A]"
            >
              Xóa
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
