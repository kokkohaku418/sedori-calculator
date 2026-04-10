export type PlatformId = "mercari" | "rakuma" | "yahoo";

export type Platform = {
  id: PlatformId;
  name: string;
  feeRate: number;
  accent: string;
};

export const PLATFORMS: Platform[] = [
  { id: "mercari", name: "メルカリ", feeRate: 10, accent: "#ff5b5b" },
  { id: "rakuma", name: "ラクマ", feeRate: 6, accent: "#00b900" },
  { id: "yahoo", name: "Yahoo!フリマ", feeRate: 5, accent: "#ff0033" },
];
