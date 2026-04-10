export type PlatformId = "mercari" | "rakuma" | "yahoo" | "amazon";

export type Platform = {
  id: PlatformId;
  name: string;
  shortName: string;
  feeRate: number;
  accent: string;
};

export const PLATFORMS: Platform[] = [
  { id: "mercari", name: "メルカリ",   shortName: "メルカリ", feeRate: 10, accent: "#ff5b5b" },
  { id: "rakuma",  name: "ラクマ",     shortName: "ラクマ",   feeRate: 6,  accent: "#00b900" },
  { id: "yahoo",   name: "Yahoo!フリマ", shortName: "Yahoo!",  feeRate: 5,  accent: "#ff0033" },
  { id: "amazon",  name: "Amazon",     shortName: "Amazon",  feeRate: 15, accent: "#ff9900" },
];

export function getPlatform(id: PlatformId): Platform {
  return PLATFORMS.find((p) => p.id === id) ?? PLATFORMS[0]!;
}
