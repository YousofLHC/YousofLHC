"use client";

/**
 * <Sim id="…" /> — MDX-facing wrapper.
 *
 * Lazily loads only the requested simulation bundle (route-level code-split),
 * so pages without sims pay nothing. Frame + caption are provided here.
 */
import dynamic from "next/dynamic";
import { SIM_CATALOG, getSim } from "./catalog";

const loading = () => (
  <div className="flex h-48 items-center justify-center font-mono text-xs text-faint">
    loading sim…
  </div>
);

const comps: Record<string, React.ComponentType> = {
  "logistic-map": dynamic(() => import("./packs/physics").then((m) => m.LogisticMap), { ssr: false, loading }),
  "double-pendulum": dynamic(() => import("./packs/physics").then((m) => m.DoublePendulum), { ssr: false, loading }),
  "wave-1d": dynamic(() => import("./packs/physics").then((m) => m.Wave1D), { ssr: false, loading }),
  "mc-pi": dynamic(() => import("./packs/physics").then((m) => m.McPi), { ssr: false, loading }),
  "gradient-descent": dynamic(() => import("./packs/physics").then((m) => m.GradientDescent), { ssr: false, loading }),
  "random-walk": dynamic(() => import("./packs/physics").then((m) => m.RandomWalk), { ssr: false, loading }),

  "ising-2d": dynamic(() => import("./packs/complex").then((m) => m.Ising2D), { ssr: false, loading }),
  "kepler-orbit": dynamic(() => import("./packs/complex").then((m) => m.KeplerOrbit), { ssr: false, loading }),
  perceptron: dynamic(() => import("./packs/complex").then((m) => m.Perceptron), { ssr: false, loading }),
  kmeans: dynamic(() => import("./packs/complex").then((m) => m.KMeans), { ssr: false, loading }),

  "michaelis-menten": dynamic(() => import("./packs/chem").then((m) => m.MichaelisMenten), { ssr: false, loading }),
  titration: dynamic(() => import("./packs/chem").then((m) => m.Titration), { ssr: false, loading }),
  boltzmann: dynamic(() => import("./packs/chem").then((m) => m.Boltzmann), { ssr: false, loading }),
  "beer-lambert": dynamic(() => import("./packs/chem").then((m) => m.BeerLambert), { ssr: false, loading }),

  "lj-md": dynamic(() => import("./packs/bio").then((m) => m.LjMd), { ssr: false, loading }),
  "hp-folding": dynamic(() => import("./packs/bio").then((m) => m.HpFolding), { ssr: false, loading }),
  "docking-scan": dynamic(() => import("./packs/bio").then((m) => m.DockingScan), { ssr: false, loading }),
  "binding-isotherm": dynamic(() => import("./packs/bio").then((m) => m.BindingIsotherm), { ssr: false, loading }),
  ramachandran: dynamic(() => import("./packs/bio").then((m) => m.Ramachandran), { ssr: false, loading }),
  "dna-melting": dynamic(() => import("./packs/bio").then((m) => m.DnaMelting), { ssr: false, loading }),
  "pk-one-comp": dynamic(() => import("./packs/bio").then((m) => m.PkOneComp), { ssr: false, loading }),
};

export function Sim({ id }: { id: string }) {
  const meta = getSim(id);
  const C = comps[id];
  if (!meta || !C) {
    return (
      <p className="my-4 rounded-lg border border-magenta/40 bg-magenta/5 px-4 py-3 font-mono text-xs text-magenta">
        Unknown sim id “{id}”. Available: {SIM_CATALOG.map((s) => s.id).join(", ")}
      </p>
    );
  }
  return (
    <figure className="my-6 rounded-2xl border border-line bg-panel/40 p-4">
      <C />
      <figcaption className="mt-3 flex flex-wrap items-baseline gap-x-2 px-1">
        <b className="font-display text-sm text-ink">{meta.title}</b>
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
          {meta.group}
        </span>
        <span className="w-full text-[12px] leading-5 text-dim">{meta.desc}</span>
      </figcaption>
    </figure>
  );
}

export default Sim;
