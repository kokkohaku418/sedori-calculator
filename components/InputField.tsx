"use client";
import type { ChangeEvent } from "react";

type Props = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  suffix?: string;
  placeholder?: string;
  inputMode?: "numeric" | "decimal";
};

function formatWithCommas(v: string): string {
  if (!v) return "";
  const [intPart, decPart] = v.split(".");
  const withCommas = (intPart ?? "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return decPart !== undefined ? `${withCommas}.${decPart}` : withCommas;
}

export default function InputField({
  label,
  value,
  onChange,
  suffix = "円",
  placeholder = "0",
  inputMode = "numeric",
}: Props) {
  const display = formatWithCommas(value);

  const handle = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^\d.]/g, "");
    onChange(raw);
  };

  return (
    <label className="block">
      <span className="block text-[12px] font-semibold text-ink-500 mb-1.5 uppercase tracking-[0.06em]">
        {label}
      </span>
      <div className="relative">
        <input
          inputMode={inputMode}
          value={display}
          onChange={handle}
          placeholder={placeholder}
          className="w-full h-[52px] px-4 pr-12 rounded-2xl bg-ink-50 border border-transparent text-[17px] font-semibold tabular text-ink-900 outline-none transition-all duration-150 focus:bg-white focus:border-ink-900 focus:shadow-ring placeholder:text-ink-300 placeholder:font-medium"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[12px] font-medium text-ink-500 pointer-events-none">
          {suffix}
        </span>
      </div>
    </label>
  );
}
