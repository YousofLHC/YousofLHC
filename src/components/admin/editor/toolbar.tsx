"use client";

import { useState, useRef, useEffect } from "react";
import {
  Bold,
  Italic,
  Code,
  Sigma,
  Workflow,
  MessageSquareQuote,
  Table2,
  Image as ImageIcon,
  Link2,
  Minus,
  Wrench,
  HelpCircle,
  ChevronDown,
  FlaskConical,
  FileCode2,
  SquareSigma,
  Braces,
} from "lucide-react";

export interface InsertFn {
  (prefix: string, middle: string, suffix?: string): void;
}

export const CODE_LANGS = [
  "python",
  "r",
  "cpp",
  "bash",
  "javascript",
  "typescript",
  "latex",
  "matlab",
  "sql",
  "json",
  "yaml",
  "text",
];

const mermaidNN = `flowchart LR
  subgraph Input["Input · features"]
    X1((x1)); X2((x2)); X3((x3))
  end
  subgraph Hidden["Hidden · GNN layer 1"]
    H1((h1)); H2((h2)); H3((h3))
  end
  subgraph Out["Output · property"]
    Y((logP))
  end
  X1 & X2 & X3 --> H1 & H2 & H3
  H1 & H2 & H3 --> Y`;

const mermaidBlocks: { label: string; code: string }[] = [
  {
    label: "flowchart (subgraphs)",
    code: `flowchart LR
  subgraph A["Left"]
    A1((a1)) --- A2((a2))
  end
  subgraph B["Right"]
    B1((b1)) --- B2((b2))
  end
  A --> B`,
  },
  { label: "neural network", code: mermaidNN },
  {
    label: "roadmap · timeline",
    code: `timeline
  title Research roadmap
  Q1 : Literature review : Baseline models
  Q2 : GNN baseline : AMP integration
  Q3 : Ablations : Paper writing
  Q4 : Submission : Code release`,
  },
  {
    label: "gantt (project plan)",
    code: `gantt
  title Project plan
  dateFormat YYYY-MM-DD
  section Development
  Literature review :a1, 2026-01-01, 30d
  Baseline model      :a2, after a1, 30d
  Experiments         :a3, after a2, 45d`,
  },
  {
    label: "sequence diagram",
    code: `sequenceDiagram
  participant A as Model
  participant B as Dataset
  A->>B: request batch
  B-->>A: x, y
  A->>A: forward / backward
  A-->>B: weights update`,
  },
  {
    label: "state diagram",
    code: `stateDiagram-v2
  [*] --> Data
  Data --> Train
  Train --> Valid
  Valid --> [*]`,
  },
];

const pythonSnippets = [
  {
    label: "RDKit · molecular descriptors",
    code: `from rdkit import Chem
from rdkit.Chem import Descriptors, Draw

mol = Chem.MolFromSmiles("CC(=O)Oc1ccccc1C(=O)O")
print("SMILES  :", Chem.MolToSmiles(mol))
print("MW      :", round(Descriptors.MolWt(mol), 2))
print("logP    :", round(Descriptors.MolLogP(mol), 2))
print("HBD     :", Descriptors.NumHDonors(mol))

img = Draw.MolToImage(mol, size=(320, 320))
img.save("molecule.png")`,
  },
  {
    label: "PyTorch · training loop",
    code: `import torch
import torch.nn as nn
from torch.utils.data import DataLoader

class Net(nn.Module):
    def __init__(self, in_dim: int, hidden: int = 64):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(in_dim, hidden), nn.ReLU(), nn.Linear(hidden, 1)
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.net(x)

model = Net(in_dim=10)
opt = torch.optim.Adam(model.parameters(), lr=1e-3)
loss_fn = nn.MSELoss()

for epoch in range(100):
    for x, y in DataLoader(dataset, batch_size=64):
        opt.zero_grad()
        loss = loss_fn(model(x), y)
        loss.backward()
        opt.step()`,
  },
  {
    label: "GNN · message-passing layer from scratch",
    code: `import torch
import torch.nn as nn

class MessagePassingLayer(nn.Module):
    """h_u^{t+1} = UPD(h_u^t, sum_{v in N(u)} MSG(h_v^t))"""

    def __init__(self, in_dim: int, out_dim: int):
        super().__init__()
        self.msg = nn.Linear(in_dim, out_dim)   # MSG_theta
        self.upd = nn.Linear(out_dim + in_dim, out_dim)  # UPD_phi

    def forward(self, h: torch.Tensor, adj: torch.Tensor) -> torch.Tensor:
        m = self.msg(h)                    # messages
        agg = adj @ m                      # sum aggregation
        return self.upd(torch.cat([h, agg], dim=-1))`,
  },
  {
    label: "numpy · linear regression",
    code: `import numpy as np

A = np.random.randn(100, 5)
w_true = np.array([1.0, -2.0, 0.5, 3.0, -1.0])
y = A @ w_true + 0.1 * np.random.randn(100)

w_hat, *_ = np.linalg.lstsq(A, y, rcond=None)
print("recovered:", np.round(w_hat, 3))
print("residual :", float(np.linalg.norm(A @ w_hat - y)))`,
  },
];

const rSnippets = [
  {
    label: "ggplot2 · publication plot",
    code: `library(ggplot2)

df <- data.frame(
  x = 1:20,
  y = sin(seq(0, 2 * pi, length.out = 20)) + rnorm(20, 0, 0.1)
)

ggplot(df, aes(x, y)) +
  geom_line(color = "#3be1ff", linewidth = 1) +
  geom_point(color = "#dce6ff", size = 2) +
  labs(title = "Simulated signal", x = "t", y = "y(t)") +
  theme_minimal() +
  theme(plot.title = element_text(hjust = 0.5))`,
  },
  {
    label: "dplyr · data pipeline",
    code: `library(dplyr)

mtcars |>
  filter(hp > 100) |>
  group_by(cyl) |>
  summarise(
    mean_mpg = mean(mpg),
    sd_mpg = sd(mpg),
    n = n()
  ) |>
  arrange(desc(mean_mpg))`,
  },
];

const cppSnippets = [
  {
    label: "Eigen · linear algebra",
    code: `#include <Eigen/Dense>
#include <iostream>

int main() {
  Eigen::MatrixXd A(3, 3);
  A << 1, 2, 3,
       4, 5, 6,
       7, 8, 10;

  std::cout << "A^-1 =\\n" << A.inverse() << "\\n";
  std::cout << "det(A) = " << A.determinant() << "\\n";
  std::cout << "eig = " << Eigen::SelfAdjointEigenSolver<Eigen::MatrixXd>(A).eigenvalues() << "\\n";
  return 0;
}`,
  },
  {
    label: "basic main · I/O",
    code: `#include <iostream>
#include <vector>
#include <numeric>

int main(int argc, char** argv) {
  std::vector<double> x = {1.0, 2.0, 3.0, 4.0};
  double mean = std::accumulate(x.begin(), x.end(), 0.0) / x.size();
  std::cout << "mean = " << mean << std::endl;
  return 0;
}`,
  },
];

const bashSnippets = [
  {
    label: "NAMD · MD simulation",
    code: `# NAMD: minimisation + short run
cat > run.namd <<'EOF'
structure   solvated.psf
coordinates solvated.pdb
parameters  par_all36_prot.prm

set temp 310
temperature $temp

# equilibration
constraints on
constraintsFile fragment.inp
minimize 500
constraints off

# production
timestep 2.0
run 5000
EOF

namd2 +p16 run.namd > run.log &
tail -f run.log`,
  },
  {
    label: "VMD · visualization & render",
    code: `# VMD: load system, style, render
cat > view.tcl <<'EOF'
mol new solvated.pdb
mol addfile traj.dcd first 0 last -1 step 1
mol delrep 0 top
mol representation Licorice 0.2 8.0 8.0
mol selection "not water"
mol color Structure
mol addrep top
rotate x by 20
display rendermode GLSL
render TachyonInternal snapshot.tga
EOF

vmd -e view.tcl`,
  },
  {
    label: "SLURM · HPC submission",
    code: `#!/bin/bash
#SBATCH --job-name=md-production
#SBATCH --ntasks=1
#SBATCH --cpus-per-task=16
#SBATCH --gpus=1
#SBATCH --time=24:00:00
#SBATCH --partition=gpu

module purge
module load namd/2.14

namd2 +p16 run.namd > run.log 2>&1`,
  },
];

const latexSnippets = [
  {
    label: "align · derivation",
    code: `\\begin{align}
x^{(t+1)} &= \\eta\\left(A^\\top r^{(t)} + x^{(t)}; \\theta^{(t)}\\right) \\\\
r^{(t)} &= y - A x^{(t)} + \\frac{b^{(t)}}{\\delta} r^{(t-1)}
\\end{align}`,
  },
  {
    label: "cases · piecewise",
    code: `\\eta(z; \\theta) =
\\begin{cases}
z - \\theta & z > \\theta \\\\
0           & |z| \\le \\theta \\\\
z + \\theta & z < -\\theta
\\end{cases}`,
  },
  {
    label: "pmatrix · matrix",
    code: `A_{n \\times n} =
\\begin{pmatrix}
a_{11} & a_{12} & \\cdots & a_{1n} \\\\
a_{21} & a_{22} & \\cdots & a_{2n} \\\\
\\vdots & \\vdots & \\ddots & \\vdots \\\\
a_{n1} & a_{n2} & \\cdots & a_{nn}
\\end{pmatrix}`,
  },
  {
    label: "tikzpicture · neural network",
    code: `$$
\\begin{tikzpicture}[x=1.3cm, y=1.3cm, >=stealth]
  \\foreach \\i in {1,...,3} \\node[circle, draw, minimum size=0.55cm] (I\\i) at (0, \\i) {};
  \\foreach \\i in {1,...,4} \\node[circle, draw, minimum size=0.55cm] (H\\i) at (2, \\i) {};
  \\foreach \\i in {1,...,2} \\node[circle, draw, minimum size=0.55cm] (O\\i) at (4, \\i) {};
  \\foreach \\i in {1,...,3} \\foreach \\j in {1,...,4} \\draw[->, thick] (I\\i) -- (H\\j);
  \\foreach \\i in {1,...,4} \\foreach \\j in {1,...,2} \\draw[->, thick] (H\\i) -- (O\\j);
\\end{tikzpicture}
$$`,
  },
  {
    label: "mhchem · reactions",
    code: `\\ce{C6H6 + H2SO4 ->[\\Delta] C6H5SO3H + H2O}

\\ce{CH3COO- + H2O <=> CH3COOH + OH-}

\\ce{^235_92U + ^1_0n -> ^144_56Ba + ^89_36Kr + 3 ^1_0n}`,
  },
  {
    label: "gather · multi-line",
    code: `\\begin{gather}
a_1 x + b_1 y = c_1 \\\\
a_2 x + b_2 y = c_2
\\end{gather}`,
  },
  {
    label: "multline · long equation",
    code: `\\begin{multline}
f(x) = a_0 + a_1x + a_2x^2 + a_3x^3 \\\\ 
+ \\cdots + a_nx^n
\\end{multline}`,
  },
  {
    label: "split · aligned halves",
    code: `$$
\\begin{split}
|x|^2 &= x\\bar{x} \\\\
      &\\le |x|(|x|+|y|)
\\end{split}
$$`,
  },
  {
    label: "alignedat · column pairs",
    code: `\\begin{alignat}{2}
x &= 1 \\\\ &\\quad + 2y &&= 3
\\end{alignat}`,
  },
  {
    label: "equation* · numbered off",
    code: `\\begin{equation*}
\\int_{-\\infty}^{\\infty} e^{-x^2}\\,dx = \\sqrt{\\pi}
\\end{equation*}`,
  },
  {
    label: "array · custom columns",
    code: `$$
\\begin{array}{c|c}
\\text{Input} & \\text{Output} \\\\ \\hline
0 & 1 \\\\
1 & 0
\\end{array}
$$`,
  },
  {
    label: "bmatrix / vmatrix",
    code: `M = \\begin{bmatrix} 1 & 2 \\\\ 3 & 4 \\end{bmatrix},
\\quad \\det M = \\begin{vmatrix} 1 & 2 \\\\ 3 & 4 \\end{vmatrix}`,
  },
  {
    label: "substack · under sum",
    code: `$$
\\sum_{\\substack{ i,j \\\\ i \\neq j }} w_{ij}
$$`,
  },
  {
    label: "boxed result",
    code: `$$
\\boxed{ \\hat{\\beta} = (X^\\top X)^{-1} X^\\top y }
$$`,
  },
  {
    label: "tag + eqref",
    code: `$$
E = mc^2 \\tag{1}
$$

As shown in \\eqref{1}, energy equals mass.`,
  },
  {
    label: "\\text{} inside math",
    code: `$$
\u062a = \\text{profit}(x) - \\text{cost}(x)
$$`,
  },
];

/* ------------------------------ Greek alphabet ------------------------------ */

const greekItems: { label: string; code: string }[] = [
  ...[
    ["α", "alpha"], ["β", "beta"], ["γ", "gamma"], ["δ", "delta"],
    ["ε", "epsilon"], ["ε var", "varepsilon"], ["ζ", "zeta"], ["η", "eta"],
    ["θ", "theta"], ["θ var", "vartheta"], ["ι", "iota"], ["κ", "kappa"],
    ["κ var", "varkappa"], ["λ", "lambda"], ["μ", "mu"], ["ν", "nu"],
    ["ξ", "xi"], ["π", "pi"], ["π var", "varpi"], ["ρ", "rho"],
    ["ρ var", "varrho"], ["σ", "sigma"], ["σ var", "varsigma"], ["τ", "tau"],
    ["υ", "upsilon"], ["φ", "phi"], ["φ var", "varphi"], ["χ", "chi"],
    ["ψ", "psi"], ["ω", "omega"],
  ].map(([glyph, cmd]) => ({ label: `${glyph}  ${cmd}`, code: `\\${cmd} ` })),
  ...[
    ["Γ", "Gamma"], ["Δ", "Delta"], ["Θ", "Theta"], ["Λ", "Lambda"],
    ["Ξ", "Xi"], ["Π", "Pi"], ["Σ", "Sigma"], ["Υ", "Upsilon"],
    ["Φ", "Phi"], ["Ψ", "Psi"], ["Ω", "Omega"],
  ].map(([glyph, cmd]) => ({ label: `${glyph}  \\${cmd}`, code: `\\${cmd} ` })),
  ...[
    ["∂", "partial"], ["∇", "nabla"], ["∞", "infty"], ["±", "pm"],
    ["×", "times"], ["÷", "div"], ["≤", "leq"], ["≥", "geq"],
    ["≈", "approx"], ["≠", "neq"], ["→", "to"], ["⇒", "Rightarrow"],
    ["∈", "in"], ["⊂", "subset"], ["∀", "forall"], ["∃", "exists"],
  ].map(([glyph, cmd]) => ({ label: `${glyph}  \\${cmd}`, code: `\\${cmd} ` })),
];

/* ------------------------------ TikZ templates ------------------------------ */

const tikzItems: { label: string; code: string }[] = [
  {
    label: "standalone picture",
    code: `\`\`\`tikz
\\begin{tikzpicture}[>=stealth, scale=1.2]
  \\draw[->] (-0.5,0) -- (4,0);
  \\draw[->] (0,-0.5) -- (0,3);
  \\draw[thick, domain=0:3.5] plot (\\x, {0.35*\\x});
  \\node[circle, draw, fill=cyan!20] at (2.4,1.4) {\$f(x)\$};
\\end{tikzpicture}
\`\`\``,
  },
  {
    label: "tree",
    code: `\`\`\`tikz
\\begin{tikzpicture}[level distance=14mm,
  every node/.style={circle, draw, minimum size=8mm}]
  \\node {A}
    child { node {B} }
    child { node {C}
      child { node {D} }
      child { node {E} } };
\\end{tikzpicture}
\`\`\``,
  },
  {
    label: "state automaton",
    code: `\`\`\`tikz
\\begin{tikzpicture}[shorten >=1pt, node distance=22mm, >=stealth,
  every state/.style={circle, draw, minimum size=8mm}]
  \\node[state] (q0) {\$q_0\$};
  \\node[state] (q1) [right of=q0] {\$q_1\$};
  \\draw[->] (q0) edge[loop above] node {a} (q0)
             (q0) edge[bend left] node {b} (q1)
             (q1) edge[bend left] node {a} (q0);
\\end{tikzpicture}
\`\`\``,
  },
  {
    label: "axes + labeled nodes",
    code: `\`\`\`tikz
\\begin{tikzpicture}[scale=0.9]
  \\draw[help lines] (0,0) grid (5,4);
  \\draw[<->] (0,4) -- (0,0) -- (5,0);
  \\foreach \\x/\\y in {1/1, 2/2.5, 3/2, 4/3.5}
     \\fill[cyan] (\\x,\\y) circle (2pt);
  \\node[right] at (4,3.5) {\$P_4\$};
\\end{tikzpicture}
\`\`\``,
  },
];

const mdxComponents = [
  {
    label: "Callout (tip)",
    code: `<Callout type="tip" title="Key insight">
Write the takeaway here.
</Callout>`,
  },
  {
    label: "Callout (warning)",
    code: `<Callout type="warning" title="Watch out">
Derive this before trusting the intuition.
</Callout>`,
  },
  {
    label: "Diagram (mermaid + caption)",
    code: `<Diagram
chart={\`
flowchart LR
  A[input] --> B{conv?}
  B -- yes --> C[GNN]
  B -- no --> D[MLP]
\`}
caption="A small decision diagram."
/>`,
  },
  {
    label: "NotebookCard",
    code: `<NotebookCard slug="gnn-molecular-property-prediction" />`,
  },
  {
    label: "Figure (lightbox image)",
    code: `![Result curve](/media/curve.png)

<!-- optional caption: -->
![Training curves](/media/curves.png "loss vs epoch")`,
  },
];

import { SIM_CATALOG, SIM_GROUPS } from "@/components/sims/catalog";

interface SnippetGroup {
  label: string;
  icon: typeof FileCode2;
  items: { label: string; code: string }[];
}

const snippets: SnippetGroup[] = [
  { label: "Greek", icon: Sigma, items: greekItems },
  { label: "TikZ", icon: Workflow, items: tikzItems },
  { label: "Python", icon: FileCode2, items: pythonSnippets },
  { label: "R / ggplot2", icon: Braces, items: rSnippets },
  { label: "C++ / Eigen", icon: Braces, items: cppSnippets },
  { label: "Bash · NAMD/VMD/SLURM", icon: Workflow, items: bashSnippets },
  { label: "LaTeX", icon: SquareSigma, items: latexSnippets },
  { label: "Mermaid", icon: Workflow, items: mermaidBlocks },
  { label: "MDX components", icon: FlaskConical, items: mdxComponents },
];

interface ToolbarProps {
  insert: InsertFn;
}

function Btn({
  title,
  onClick,
  children,
}: {
  title: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-dim transition-colors hover:bg-panel hover:text-cyan"
    >
      {children}
    </button>
  );
}

function Dropdown({
  label,
  icon: Icon,
  children,
  align = "left",
}: {
  label: string;
  icon: typeof Code;
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`inline-flex h-7 items-center gap-1 rounded-md px-1.5 text-dim transition-colors hover:bg-panel hover:text-cyan ${
          open ? "bg-panel text-cyan" : ""
        }`}
      >
        <Icon size={13} />
        <span className="font-mono text-[11px]">{label}</span>
        <ChevronDown size={11} className={open ? "rotate-180 transition-transform" : "transition-transform"} />
      </button>
      {open && (
        <div
          className={`absolute top-9 z-30 max-h-80 w-64 overflow-y-auto rounded-xl border border-line bg-panel/85 p-1.5 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.35)] backdrop-blur-md ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export function EditorToolbar({ insert }: ToolbarProps) {
  const [codeLang, setCodeLang] = useState("python");
  const [showHelp, setShowHelp] = useState(false);

  const codeBlock = (lang: string) =>
    insert(`\`\`\`${lang}\n`, "code goes here", `\n\`\`\``);

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-1 rounded-lg border border-line bg-void/30 px-2 py-1.5 backdrop-blur-sm">
        <Btn title="Bold" onClick={() => insert("**", "bold text", "**")}>
          <Bold size={13} />
        </Btn>
        <Btn title="Italic" onClick={() => insert("_", "italic text", "_")}>
          <Italic size={13} />
        </Btn>
        <Btn title="Inline code" onClick={() => insert("`", "code", "`")}>
          <Code size={13} />
        </Btn>
        <Btn title="Inline math  $x$" onClick={() => insert("$", "x \\in \\mathbb{R}^n", "$")}>
          <Sigma size={13} />
        </Btn>
        <Btn
          title="Display math"
          onClick={() => insert("\n$$\n", "x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}", "\n$$\n")}
        >
          <SquareSigma size={13} />
        </Btn>
        <Btn title="Image" onClick={() => insert("![alt text](/media/", "image.png", ")")}>
          <ImageIcon size={13} />
        </Btn>
        <Btn title="Link" onClick={() => insert("[text](https://", "example.com", ")")}>
          <Link2 size={13} />
        </Btn>
        <Btn title="Horizontal rule" onClick={() => insert("\n\n---\n\n", "")}>
          <Minus size={13} />
        </Btn>

        <span className="mx-1 h-5 w-px bg-line" />

        <Dropdown label="code" icon={Code}>
          <div className="p-1">
            <div className="flex flex-wrap gap-1">
              {CODE_LANGS.map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => {
                    setCodeLang(l);
                    codeBlock(l);
                  }}
                  className={`rounded-md px-2 py-1 font-mono text-[11px] transition-colors ${
                    codeLang === l
                      ? "bg-cyan/15 text-cyan"
                      : "text-dim hover:bg-panel hover:text-ink"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </Dropdown>

        <Dropdown label="callout" icon={MessageSquareQuote}>
          <div className="space-y-0.5 p-1">
            {(["note", "tip", "warning", "danger"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() =>
                  insert(
                    `<Callout type="${t}" title="${t}">\n`,
                    "Write the message here.",
                    `\n</Callout>`
                  )
                }
                className="w-full rounded-md px-2.5 py-1.5 text-left font-mono text-[11px] text-dim transition-colors hover:bg-panel hover:text-ink"
              >
                {t}
              </button>
            ))}
          </div>
        </Dropdown>

        <Btn
          title="Insert mermaid block"
          onClick={() =>
            insert(
              "```mermaid\n",
              "flowchart LR\n  A[Start] --> B{Decision?}\n  B -- yes --> C[Done]",
              "\n```"
            )
          }
        >
          <Workflow size={13} />
        </Btn>

        <Btn
          title="Insert markdown table"
          onClick={() =>
            insert(
              "\n| Column A | Column B |\n| --- | --- |\n| value 1 | value 2 |\n| value 3 | value 4 |\n",
              ""
            )
          }
        >
          <Table2 size={13} />
        </Btn>


        <Dropdown label="plots & sims" icon={FlaskConical}>
          <div className="space-y-2 p-1.5">
            {Object.entries(SIM_GROUPS).map(([gkey, glabel]) => (
              <div key={gkey}>
                <p className="mb-1 px-1.5 font-mono text-[10px] uppercase tracking-wider text-faint">{glabel}</p>
                {SIM_CATALOG.filter(s => s.group === gkey).map(s => (
                  <button
                    key={s.id}
                    type="button"
                    title={s.desc}
                    onClick={() => insert(`<Sim id="${s.id}" />`, "", "\n")}
                    className="block w-full rounded-md px-2.5 py-1.5 text-left text-[12px] text-dim transition-colors hover:bg-panel hover:text-ink"
                  >
                    {s.title}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </Dropdown>
`n        <span className="mx-1 h-5 w-px bg-line" />

        <Dropdown label="snippets" icon={Wrench}>
          <div className="space-y-2 p-1.5">
            {snippets.map((g) => (
              <div key={g.label}>
                <p className="mb-1 flex items-center gap-1.5 px-1.5 font-mono text-[10px] uppercase tracking-wider text-faint">
                  <g.icon size={11} /> {g.label}
                </p>
                {g.items.map((s) => (
                  <button
                    key={s.label}
                    type="button"
                    onClick={() => insert(s.code, "", s.code.endsWith("\n") ? "" : "\n")}
                    className="block w-full rounded-md px-2.5 py-1.5 text-left text-[12px] text-dim transition-colors hover:bg-panel hover:text-ink"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </Dropdown>

        <span className="mx-1 h-5 w-px bg-line" />

        <Btn
          title="Syntax help"
          onClick={() => setShowHelp((h) => !h)}
        >
          <HelpCircle size={13} className={showHelp ? "text-cyan" : ""} />
        </Btn>
      </div>

      {showHelp && <SyntaxHelp />}
    </div>
  );
}

function KV({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <p className="rounded-md border border-line bg-void/25 px-3 py-2">
      <code className="font-mono text-[11px] text-cyan">{k}</code>
      <span className="mt-1 block text-[12px] leading-5 text-dim">{children}</span>
    </p>
  );
}

function SyntaxHelp() {
  return (
    <div className="grid gap-2 rounded-xl border border-line bg-void/20 p-4 md:grid-cols-2 lg:grid-cols-3">
      <KV k="```lang">Fenced code with syntax highlighting: python, r, cpp, bash, latex, matlab, sql, json, yaml…</KV>
      <KV k="```mermaid">Live diagram: flowchart, sequenceDiagram, timeline (roadmap), gantt, stateDiagram-v2, classDiagram…</KV>
      <KV k="$…$ / $$…$$">KaTeX math. Chemistry with <code>{"\\ce{...}"}</code> (mhchem). Auto-renders live in the preview.</KV>
      <KV k="<Callout type=…>">note · tip · warning · danger boxes with a title.</KV>
      <KV k={"<Diagram chart={`…`} />"}>Mermaid diagram with an optional caption.</KV>
      <KV k="<NotebookCard slug=… />">Links an interactive notebook page.</KV>
      <KV k="![alt](/media/x.png)">Images route through the Lightbox; optional caption via title attr.</KV>
      <KV k="#### Headings"># → h2 · ## → article h3 · used for the outline and breadcrumbs.</KV>
      <KV k="extensions">GFM: tables, task lists, strikethrough, footnotes, auto links.</KV>
      <KV k="frontmatter">title, description, date, tags, cover, subject, order, pdf, draft, readTime (auto).</KV>
      <KV k="media bank">Upload files at Admin → Media (/admin/media), paths look like /media/name.png.</KV>
    </div>
  );
}