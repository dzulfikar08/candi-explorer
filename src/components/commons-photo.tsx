import type { Photo } from "@/candi/types";
import { cn } from "@/lib/utils";

/**
 * A Wikimedia Commons photo with the credit its licence asks for: author, licence, and a link to
 * the file page. `alt` describes the photo for screen readers; the caption, when there is one,
 * is visible text.
 */
export function CommonsPhoto({ photo, alt, className }: { photo: Photo; alt: string; className?: string }) {
  return (
    <figure className={cn("m-0", className)}>
      <img
        src={photo.src}
        alt={alt}
        width={photo.width}
        height={photo.height}
        loading="lazy"
        decoding="async"
        className="block aspect-[3/2] w-full rounded-md bg-muted object-cover"
      />
      <figcaption className="mt-1.5 text-xs leading-snug text-muted-foreground">
        {photo.caption && <span className="text-foreground">{photo.caption}. </span>}
        Photo:{" "}
        <a href={photo.page} target="_blank" rel="noopener" className="underline decoration-foreground/30 underline-offset-2 hover:text-foreground">
          {photo.author}, {photo.license}
          <span className="sr-only"> (Wikimedia Commons, opens in a new tab)</span>
        </a>
      </figcaption>
    </figure>
  );
}
