"use client";

import { useState } from "react";
import { addCategory } from "./actions";

export default function CategoryForm() {
  const [type, setType] = useState("expense");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    await addCategory(formData);
    setLoading(false);
    (document.getElementById("cat-form") as HTMLFormElement)?.reset();
  }

  return (
    <form id="cat-form" action={handleSubmit} className="card space-y-3">
      <h2 className="font-display font-semibold">Thêm danh mục</h2>

      <input
        type="text"
        name="name"
        placeholder="Tên danh mục (vd: Ăn uống)"
        required
        className="input"
      />

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

      <button type="submit" disabled={loading} className="btn-primary">
        {loading ? "Đang lưu..." : "Thêm danh mục"}
      </button>
    </form>
  );
}
