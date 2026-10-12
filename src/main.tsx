import { lazy, StrictMode, Suspense, useEffect } from "react";
import { createRoot } from "react-dom/client";
import type { JSX } from "react";
import { CANDI } from "@/candi";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AdvertisePage } from "@/app/advertise/advertise-page";

import "./globals.css";

const AtlasPage = lazy(() => import("@/app/map/atlas-page").then((m) => ({ default: m.AtlasPage })));
const TemplePage = lazy(() => import("@/app/temple/temple-page").then((m) => ({ default: m.TemplePage })));

// `/` is the map of all temples; `/advertise` is the sponsor page; `/<id>` opens a
// temple. Switching between pages stays a full page load for a clean 3D scene.
function resolve(): { page: "atlas" | "advertise" | "temple"; focusId: string | null; index: number } {
  const requested = location.pathname.split("/")[1] ?? "";
  if (requested === "advertise") return { page: "advertise", focusId: null, index: -1 };
  const index = CANDI.findIndex((c) => c.id === requested);
  if (index >= 0) return { page: "temple", focusId: null, index };
  if (requested !== "") history.replaceState(null, "", "/");
  return { page: "atlas", focusId: new URLSearchParams(location.search).get("from"), index: -1 };
}

function Loading(): JSX.Element {
  return (
    <div className="fixed inset-0 grid place-items-center bg-background text-sm text-muted-foreground">
      Laying the stones…
    </div>
  );
}

function App(): JSX.Element {
  const route = resolve();
  useEffect(() => {
    document.title =
      route.page === "advertise"
        ? "Advertise on Candi Explorer"
        : route.page === "temple"
          ? `${CANDI[route.index].name} · Candi Explorer`
          : "Candi Explorer · Temples of Indonesia in 3D";
  }, [route.page, route.index]);

  let body: JSX.Element;
  if (route.page === "advertise") {
    body = <AdvertisePage />;
  } else if (route.page === "temple") {
    body = (
      <Suspense fallback={<Loading />}>
        <TemplePage index={route.index} />
      </Suspense>
    );
  } else {
    body = (
      <Suspense fallback={<Loading />}>
        <AtlasPage focusId={route.focusId} />
      </Suspense>
    );
  }

  return <TooltipProvider>{body}</TooltipProvider>;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
