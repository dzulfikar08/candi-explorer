import { REGION_NAMES, type Temple } from "./index";

const fold = (text: string) =>
  text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

/** Whether every word of `query` appears in the temple's name, regency or region, ignoring case and accents. */
export function matchesQuery(c: Temple, query: string): boolean {
  const haystack = fold(`${c.name} ${c.location} ${REGION_NAMES[c.region]}`);
  return fold(query)
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => haystack.includes(word));
}
