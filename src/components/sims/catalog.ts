/** Server-safe simulation catalog (no client code) — used by admin inserter,
 *  MDX <Sim/> wrapper and docs. */

export type SimGroup = "physics" | "complex" | "chem" | "bio";

export interface SimMeta {
  id: string;
  title: string;
  group: SimGroup;
  desc: string;
}

export const SIM_GROUPS: Record<SimGroup, string> = {
  physics: "Physics / Math",
  complex: "Complex Systems",
  chem: "Chemistry",
  bio: "Biochem · Biophysics · Drug design",
};

export const SIM_CATALOG: SimMeta[] = [
  { id: "logistic-map", title: "Logistic map — bifurcation", group: "physics",
    desc: "Period doubling → chaos in xₙ₊₁ = r·xₙ(1−xₙ)." },
  { id: "double-pendulum", title: "Double pendulum", group: "physics",
    desc: "Chaotic double arm with energy readout." },
  { id: "wave-1d", title: "Wave equation (1-D string)", group: "physics",
    desc: "Explicit finite-difference wave with damping & tension." },
  { id: "mc-pi", title: "Monte-Carlo π", group: "physics",
    desc: "Uniform sampling estimate of π with live convergence." },
  { id: "gradient-descent", title: "Gradient-descent playground", group: "physics",
    desc: "Descent paths on a rippled convex surface; momentum + lr." },
  { id: "random-walk", title: "Random walk & diffusion", group: "physics",
    desc: "Ensemble of walkers; ⟨r²⟩ ∝ t diffusion slope." },

  { id: "ising-2d", title: "Ising model (2-D)", group: "complex",
    desc: "Metropolis spins near Tc; magnetization trace." },
  { id: "kepler-orbit", title: "Kepler orbit integrator", group: "complex",
    desc: "Velocity-Verlet two-body orbit; area law check." },
  { id: "perceptron", title: "Perceptron learning", group: "complex",
    desc: "Linear separator trained live on two Gaussian blobs." },
  { id: "kmeans", title: "K-means clustering", group: "complex",
    desc: "Lloyd iterations with centroid trails." },

  { id: "michaelis-menten", title: "Michaelis–Menten kinetics", group: "chem",
    desc: "v vs [S] with Vmax/Km sliders; Lineweaver–Burk inset." },
  { id: "titration", title: "Titration curve (Henderson–Hasselbalch)", group: "chem",
    desc: "pH vs equivalents around any pKa." },
  { id: "boltzmann", title: "Boltzmann distribution", group: "chem",
    desc: "P(E) ∝ e^(−E/kT); temperature sweep." },
  { id: "beer-lambert", title: "Beer–Lambert absorption", group: "chem",
    desc: "A = ε·l·c with transmittance color chip." },

  { id: "lj-md", title: "Lennard-Jones mini-MD", group: "bio",
    desc: "N-particle Verlet MD at target T — proto molecular dynamics." },
  { id: "hp-folding", title: "HP protein-folding lattice", group: "bio",
    desc: "Hydrophobic-polar chain folding by Monte-Carlo moves." },
  { id: "docking-scan", title: "Docking landscape scanner", group: "bio",
    desc: "Pose scan over a receptor pocket pseudo-energy grid." },
  { id: "binding-isotherm", title: "Binding isotherm / Kd ± inhibitor", group: "bio",
    desc: "θ vs log[L] for multiple affinities + competitor." },
  { id: "ramachandran", title: "Ramachandran explorer", group: "bio",
    desc: "φ/ψ allowed regions with a movable marker." },
  { id: "dna-melting", title: "DNA melting curve", group: "bio",
    desc: "GC-content dependent Tm sigmoid." },
  { id: "pk-one-comp", title: "Pharmacokinetics (1-compartment)", group: "bio",
    desc: "Oral C(t) with ka/ke sliders and t½ readout." },
];

export function getSim(id: string): SimMeta | undefined {
  return SIM_CATALOG.find((s) => s.id === id);
}
