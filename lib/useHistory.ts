"use client";
import { useCallback, useEffect, useState } from "react";
import type { PlatformId } from "./platforms";
import type { Verdict } from "./calc";

export type HistoryEntry = {
  id: string;
  createdAt: number;
  name: string;
  platform: PlatformId;
  cost: number;
  price: number;
  feeRate: number;
  shipping: number;
  fixedCost: number;
  profit: number;
  marginRate: number;
  verdict: Verdict;
};

const KEY = "sedori:history:v1";
const MAX = 50;

export function useHistory() {
  const [items, setItems] = useState<HistoryEntry[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw) as HistoryEntry[]);
    } catch {
      // ignore
    }
    setReady(true);
  }, []);

  const persist = useCallback((next: HistoryEntry[]) => {
    setItems(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  }, []);

  const save = useCallback(
    (entry: Omit<HistoryEntry, "id" | "createdAt">) => {
      const id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      const next: HistoryEntry[] = [
        { ...entry, id, createdAt: Date.now() },
        ...items,
      ].slice(0, MAX);
      persist(next);
    },
    [items, persist]
  );

  const remove = useCallback(
    (id: string) => persist(items.filter((i) => i.id !== id)),
    [items, persist]
  );

  const clear = useCallback(() => persist([]), [persist]);

  const stats = {
    total: items.length,
    ok: items.filter((i) => i.verdict === "ok").length,
    warn: items.filter((i) => i.verdict === "warn").length,
    ng: items.filter((i) => i.verdict === "ng").length,
  };

  return { items, save, remove, clear, ready, stats };
}
