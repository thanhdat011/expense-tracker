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
        <div key={t.id} className="ledger-row gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-sm break-words text-[#5C5940]">
              {new Date(t.txn_date).toLocaleDateString("vi-VN")}
              {t.categories && ` · ${t.categories.name}`}
              {t.accounts && ` · ${t.accounts.name}`}
              {t.note && ` · ${t.note}`}
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1">
            <p
              className="font-mono text-sm font-semibold sm:text-base"
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
            <div className="flex gap-3">
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
        </div>
      ))}
    </div>
  );
}
