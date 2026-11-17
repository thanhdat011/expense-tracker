export function formatMoneyShort(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  const trim = (n: number) =>
    n.toLocaleString("vi-VN", { maximumFractionDigits: 2 });

  if (abs >= 1_000_000_000) return `${sign}${trim(abs / 1_000_000_000)}tỷ`;
  if (abs >= 1_000_000) return `${sign}${trim(abs / 1_000_000)}tr`;
  return `${sign}${abs.toLocaleString("vi-VN")}đ`;
}

export function formatMoneyFull(value: number): string {
  return `${value.toLocaleString("vi-VN")}đ`;
}
