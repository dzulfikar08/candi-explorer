/**
 * Cross-promo card for the maker's other products, ported from AturPDF's ad rail
 * (aturpdf/frontend/src/data/ads.ts). One card rotates every ROTATE_MS under the brand
 * panel; paid slots are sold by email until a checkout exists.
 */

interface Promo {
  name: string;
  tagline: string;
  href: string;
  /** Self-hosted under public/ad-icons. */
  icon: string;
}

// Every entry's site answered 200 on 2026-10-12. Keep in sync with AturPDF's list.
const PROMOS: Promo[] = [
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

const ROTATE_MS = 5000;
const ADVERTISE_HREF = `mailto:dzulfikar.at@gmail.com?subject=${encodeURIComponent("Sponsor slot on Candi Explorer")}`;

/** Renders the rotating card into `root`. Rotation pauses on hover/focus and is off under reduced motion. */
export function mountPromo(root: HTMLElement): void {
  const card = document.createElement("a");
  card.className = "promo-card";
  card.target = "_blank";
  card.rel = "noopener";
  const icon = document.createElement("img");
  icon.alt = "";
  icon.width = 32;
  icon.height = 32;
  const name = document.createElement("span");
  name.className = "promo-name";
  const tagline = document.createElement("span");
  tagline.className = "promo-tagline";
  card.append(icon, name, tagline);

  const meta = document.createElement("p");
  meta.className = "promo-meta";
  const advertise = document.createElement("a");
  advertise.href = ADVERTISE_HREF;
  advertise.textContent = "Your product here";
  meta.append("More from us", advertise);
  root.append(card, meta);

  const links = PROMOS.map((p) => {
    const url = new URL(p.href);
    url.searchParams.set("utm_source", "candi-explorer");
    url.searchParams.set("utm_medium", "cross-promo");
    url.searchParams.set("utm_campaign", "product-network");
    url.searchParams.set("utm_content", "corner-card");
    return url.toString();
  });
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // Random start so each visit features a different product first.
  let index = Math.floor(Math.random() * PROMOS.length);
  const show = () => {
    const p = PROMOS[index];
    card.href = links[index];
    icon.src = p.icon;
    name.textContent = p.name;
    tagline.textContent = p.tagline;
  };
  show();
  if (reducedMotion) return;

  let held = false;
  root.addEventListener("pointerenter", () => (held = true));
  root.addEventListener("pointerleave", () => (held = false));
  root.addEventListener("focusin", () => (held = true));
  root.addEventListener("focusout", () => (held = false));
  window.setInterval(() => {
    if (held || document.hidden || root.offsetParent === null) return;
    index = (index + 1) % PROMOS.length;
    show();
    card.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 400, easing: "ease-out" });
  }, ROTATE_MS);
}
