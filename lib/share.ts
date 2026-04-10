import type { PlatformId } from "./platforms";

export type ShareState = {
  p?: PlatformId;
  c?: number;
  s?: number; // sale price
  sh?: number;
  f?: number;
  fx?: number;
  cat?: string;
};

export function encodeShare(state: ShareState): string {
  const params = new URLSearchParams();
  if (state.p) params.set("p", state.p);
  if (state.c != null && state.c > 0) params.set("c", String(state.c));
  if (state.s != null && state.s > 0) params.set("s", String(state.s));
  if (state.sh != null && state.sh > 0) params.set("sh", String(state.sh));
  if (state.f != null) params.set("f", String(state.f));
  if (state.fx != null && state.fx > 0) params.set("fx", String(state.fx));
  if (state.cat) params.set("cat", state.cat);
  return params.toString();
}

export function decodeShare(params: URLSearchParams): ShareState {
  const out: ShareState = {};
  const p = params.get("p");
  if (p === "mercari" || p === "rakuma" || p === "yahoo" || p === "amazon") out.p = p;
  const num = (k: string) => {
    const v = params.get(k);
    if (v == null) return undefined;
    const n = Number(v);
    return Number.isFinite(n) && n >= 0 ? n : undefined;
  };
  // 値が存在する場合のみキーをセット（undefined を入れないことで
  // Object.keys().length での「URL有無」判定を正しく機能させる）
  const c = num("c");
  if (c != null) out.c = c;
  const s = num("s");
  if (s != null) out.s = s;
  const sh = num("sh");
  if (sh != null) out.sh = sh;
  const f = num("f");
  if (f != null) out.f = f;
  const fx = num("fx");
  if (fx != null) out.fx = fx;
  const cat = params.get("cat");
  if (cat) out.cat = cat;
  return out;
}

export function buildShareUrl(origin: string, state: ShareState): string {
  const qs = encodeShare(state);
  return qs ? `${origin}/?${qs}` : `${origin}/`;
}
