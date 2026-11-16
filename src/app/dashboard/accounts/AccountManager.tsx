"use client";

import { useState } from "react";
import { addAccount, deleteAccount } from "./actions";

type Account = {
  id: string;
  name: string;
  type: string;
  initial_balance: number;
};

const TYPE_LABEL: Record<string, string> = {
  cash: "Tiền mặt",
  bank: "Ngân hàng",
  ewallet: "Ví điện tử",
};

export default function AccountManager({ accounts }: { accounts: Account[] }) {
  const [loading, setLoading] = useState(false);
  const [balanceDisplay, setBalanceDisplay] = useState("");

  function formatNumber(value: string) {
    const digits = value.replace(/\D/g, "");
    return digits ? Number(digits).toLocaleString("en-US") : "";
  }

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    await addAccount(formData);
    setLoading(false);
    setBalanceDisplay("");
    (document.getElementById("acc-form") as HTMLFormElement)?.reset();
  }

  async function handleDelete(id: string) {
    if (!confirm("Xóa ví này?")) return;
    try {
      await deleteAccount(id);
    } catch (e) {
      alert((e as Error).message);
    }
  }

  return (
    <div className="space-y-4">
      <form id="acc-form" action={handleSubmit} className="card space-y-3">
        <h2 className="font-display font-semibold">Thêm ví</h2>
        <input
          name="name"
          placeholder="Tên ví (vd: Vietcombank)"
          required
          className="input"
        />
        <select name="type" className="input">
          <option value="cash">Tiền mặt</option>
          <option value="bank">Ngân hàng</option>
          <option value="ewallet">Ví điện tử (MoMo, ZaloPay...)</option>
        </select>
        <input
          type="text"
          inputMode="numeric"
          placeholder="Số dư ban đầu"
          value={balanceDisplay}
          onChange={(e) => setBalanceDisplay(formatNumber(e.target.value))}
          className="input font-mono"
        />
        <input
          type="hidden"
          name="initial_balance"
          value={balanceDisplay.replace(/,/g, "")}
        />
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? "Đang lưu..." : "Thêm ví"}
        </button>
      </form>

      <div className="card">
        {accounts.map((a) => (
          <div key={a.id} className="ledger-row">
            <div>
              <p>{a.name}</p>
              <p className="text-xs text-[#8A8367]">{TYPE_LABEL[a.type]}</p>
            </div>
            <button
              onClick={() => handleDelete(a.id)}
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
