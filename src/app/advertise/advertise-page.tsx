import type { JSX } from "react";
import { ArrowLeft, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ADVERTISE,
  PAKASIR_SLUG,
  SPOTS_TOTAL,
  sponsorCheckoutUrl,
  spotsLeft,
  testimonials,
} from "@/data/sponsor";

/**
 * Public sponsor page at /advertise — mirrors AturPDF's page. The Pakasir CTA stays
 * disabled until PAKASIR_SLUG is configured in data/sponsor.ts.
 */
export function AdvertisePage(): JSX.Element {
  const left = spotsLeft();
  const checkoutUrl = sponsorCheckoutUrl("advertise-page");
  const stats: Array<[string, string]> = [
    ["QRIS", "Instant payment"],
    [ADVERTISE.priceLabel, ADVERTISE.pricePeriod],
    [`${left}/${SPOTS_TOTAL}`, "Spots left"],
  ];
  const ctaLabel = `Get started — ${ADVERTISE.priceLabel}/mo via QRIS`;
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <a
        href="/"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden="true" /> Back to the map
      </a>
      <div className="mb-8 text-center">
        <div className="mb-3 flex justify-center text-primary">
          <Megaphone className="size-10" aria-hidden="true" />
        </div>
        <h1 className="font-heading text-2xl font-bold">{ADVERTISE.headline}</h1>
        <p className="mt-1 text-muted-foreground">{ADVERTISE.sub}</p>
      </div>

      <div className="mx-auto max-w-xl space-y-6">
        <div className="grid grid-cols-3 gap-2">
          {stats.map(([big, small]) => (
            <div key={small} className="rounded-lg border bg-card p-3 text-center">
              <p className="text-lg font-bold">{big}</p>
              <p className="text-xs text-muted-foreground">{small}</p>
            </div>
          ))}
        </div>

        <div>
          <h2 className="mb-1 text-sm font-semibold">How it works</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">{ADVERTISE.howItWorks}</p>
        </div>

        <div>
          <h2 className="mb-1 text-sm font-semibold">Pricing</h2>
          <p className="text-sm text-muted-foreground">
            Monthly rate: <span className="font-semibold text-foreground">{ADVERTISE.priceLabel}</span> (
            {ADVERTISE.pricePeriod})
          </p>
          <p className="text-sm text-muted-foreground">
            {left} spots available now. {ADVERTISE.checkoutNote}
          </p>
        </div>

        {testimonials.length > 0 && (
          <div>
            <h2 className="mb-2 text-sm font-semibold">What sponsors say</h2>
            <div className="space-y-3">
              {testimonials.map((ts) => (
                <figure key={ts.author} className="rounded-lg border bg-card p-3">
                  <blockquote className="text-sm text-muted-foreground">&ldquo;{ts.quote}&rdquo;</blockquote>
                  <figcaption className="mt-2 text-xs font-medium">
                    {ts.author} · {ts.company}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        )}

        <div>
          {checkoutUrl ? (
            <Button
              className="h-10 w-full"
              render={
                <a href={checkoutUrl} target="_blank" rel="noopener noreferrer" />
              }
            >
              {ctaLabel}
            </Button>
          ) : (
            <Button disabled title="Payment link is being set up" className="h-10 w-full">
              {ctaLabel}
            </Button>
          )}
          <p className="mt-2 text-center text-xs text-muted-foreground">
            {PAKASIR_SLUG
              ? "Checkout opens Pakasir in a new tab; pay by QRIS."
              : "QRIS checkout is not wired up yet."}
          </p>
        </div>
      </div>
    </div>
  );
}
