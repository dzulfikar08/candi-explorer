/**
 * Sponsor inventory and checkout, ported from AturPDF's data/ads.ts. The cross-promo
 * card and the /advertise page both read from here so the spots-left count stays true.
 */

export interface Promo {
  name: string;
  tagline: string;
  href: string;
  /** Self-hosted under public/ad-icons. */
  icon: string;
}

// Every entry's site answered 200 on 2026-10-12. Keep in sync with AturPDF's list.
export const PROMOS: Promo[] = [
  { name: "Atur", tagline: "One workspace for teams and their agents", href: "https://diatur.com", icon: "/ad-icons/atur.ico" },
  { name: "AturPDF", tagline: "Private PDF tools that run in your browser", href: "https://pdf.diatur.com", icon: "/ad-icons/aturpdf.svg" },
  { name: "Nempel", tagline: "Turn every laptop into signage media", href: "https://nempel.com", icon: "/ad-icons/nempel.png" },
  { name: "E-Pondok", tagline: "Effortless pondok administration", href: "https://epondok.id", icon: "/ad-icons/e-pondok.svg" },
  { name: "RevKlik", tagline: "Simple web analytics", href: "https://revklik.com", icon: "/ad-icons/revklik.webp" },
  { name: "Cowculator", tagline: "Feed ration calculator & breed tracking for dairy", href: "https://cowculator.id", icon: "/ad-icons/cowculator.ico" },
  { name: "Voltrus", tagline: "Industrial automation tools for macOS & Linux", href: "https://voltrus.id", icon: "/ad-icons/voltrus.ico" },
  { name: "Paparan AI", tagline: "Documents in, decks out: AI for government, consulting & presales", href: "https://paparanai.id", icon: "/ad-icons/paparanai.svg" },
  { name: "WeLoveOurBaby", tagline: "One place for what's coming, and everything after", href: "https://weloveourbaby.com", icon: "/ad-icons/weloveourbaby.svg" },
  { name: "OpexMX", tagline: "AI Maintenance eXecution for Operational Excellence", href: "https://opexmx.com", icon: "/ad-icons/opexmx.png" },
  { name: "JoyoDigitama", tagline: "Industrial digitalization & IoT solutions", href: "https://joyodigitama.com", icon: "/ad-icons/joyodigitama.ico" },
  { name: "Waqtu", tagline: "Prayer times in your menu bar for Mac", href: "https://getwaqtu.com", icon: "/ad-icons/waqtu.png" },
];

// Ad inventory capacity: the card rotates through every entry (5 s per step), so the
// list can grow up to SPOTS_TOTAL while each entry stays visible.
export const SPOTS_TOTAL = 20;
export const spotsLeft = (): number => Math.max(0, SPOTS_TOTAL - PROMOS.length);

// Sponsor-slot pricing and checkout. Payments run through Pakasir QRIS
// (https://pakasir.com/p/docs): create a project at app.pakasir.com and put
// its slug below — until then the Get-started button stays disabled.
export const PAKASIR_SLUG = "";
export const SPONSOR_PRICE_IDR = 19_900;
export const ADVERTISE = {
  headline: "Advertise on Candi Explorer",
  sub: "Your startup, in front of people exploring Indonesia's temples in 3D.",
  priceLabel: "Rp 19.900",
  pricePeriod: "per month",
  howItWorks:
    "Your startup appears in rotating sponsor cards under the temple title and in the map sidebar. Slots rotate every 5 seconds to ensure fair visibility among all advertisers.",
  checkoutNote: "Pay via QRIS through Pakasir. Your slot goes live right after payment. Cancel anytime.",
} as const;

/** Pakasir QRIS checkout URL for one sponsor slot. Returns '' while PAKASIR_SLUG is unconfigured. */
export function sponsorCheckoutUrl(placement: string): string {
  if (!PAKASIR_SLUG) return "";
  const orderId = `candi-sponsor-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  return `https://app.pakasir.com/pay/${PAKASIR_SLUG}/${SPONSOR_PRICE_IDR}?order_id=${orderId}&qris_only=1&utm_source=candi-explorer&utm_medium=sponsor&utm_content=${encodeURIComponent(placement)}`;
}

/** Append full UTM attribution to an outbound product link so every cross-promo click is traceable. */
export function utmUrl(href: string, placement: string): string {
  const url = new URL(href);
  url.searchParams.set("utm_source", "candi-explorer");
  url.searchParams.set("utm_medium", "cross-promo");
  url.searchParams.set("utm_campaign", "product-network");
  url.searchParams.set("utm_content", placement);
  return url.toString();
}

export interface Testimonial {
  quote: string;
  author: string;
  company: string;
}
// Real advertiser quotes only — the "What sponsors say" section renders once this is non-empty.
export const testimonials: Testimonial[] = [];
