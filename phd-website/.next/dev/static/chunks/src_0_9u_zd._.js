(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/landing/cinematic-hero.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CinematicHero",
    ()=>CinematicHero,
    "buildHeroSlides",
    ()=>buildHeroSlides
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUpRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-up-right.mjs [app-client] (ecmascript) <export default as ArrowUpRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2d$clock$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CalendarClock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/calendar-clock.mjs [app-client] (ecmascript) <export default as CalendarClock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.mjs [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pause$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pause$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/pause.mjs [app-client] (ecmascript) <export default as Pause>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/play.mjs [app-client] (ecmascript) <export default as Play>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$typed$2d$text$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/landing/typed-text.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/lib/data.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$generated$2f$content$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/generated/content.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$site$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/lib/site.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$generated$2f$site$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/generated/site.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
const FALLBACK_TITLES = [
    "Molecules & Medicine",
    "Decoding the Helix",
    "Silicon & Signal",
    "Discovery at Scale",
    "Patterns of Life",
    "Structure & Form"
];
const TAG_KEYWORDS = [
    [
        /dna|genom|helix|bio|cell|molecul|protein/i,
        "BIOINFORMATICS"
    ],
    [
        /ai|chip|circuit|silicon|neural|robot|agent/i,
        "ARTIFICIAL INTELLIGENCE"
    ],
    [
        /data|cloud|network|graph|compute|deepmind/i,
        "DATA & SYSTEMS"
    ],
    [
        /discover|research|lab|science/i,
        "RESEARCH"
    ],
    [
        /pharma|drug|medicine|pill/i,
        "PHARMACOLOGY"
    ],
    [
        /math|structure|lattice|crystal|geometry|shuper/i,
        "MATHEMATICS"
    ],
    [
        /flyd|liquid|ink|fluid/i,
        "FLUID DYNAMICS"
    ]
];
function humanize(file) {
    const name = file.replace(/\.[^.]+$/, "").replace(/-unsplash$/i, "");
    const parts = name.split(/[-_]/).filter((p)=>p && !/^[a-z0-9]{6,}$/i.test(p)).map((p)=>p.charAt(0).toUpperCase() + p.slice(1).toLowerCase());
    return parts.join(" ");
}
function guessTag(file) {
    for (const [re, tag] of TAG_KEYWORDS)if (re.test(file)) return tag;
    return "RESEARCH";
}
function buildHeroSlides(images) {
    return images.map((src, i)=>{
        const file = src.split("/").pop() ?? src;
        const human = humanize(file);
        return {
            src,
            tag: guessTag(file),
            title: human || FALLBACK_TITLES[i % FALLBACK_TITLES.length]
        };
    });
}
const DUR = 7000;
const typedRoles = [
    "Machine learning & deep learning",
    "LLM & agentic AI systems",
    "Bioinformatics & molecular simulation",
    "Information theory",
    "Distributed & federated learning",
    "Optimization & message passing",
    "Mathematics educator",
    "Python · R · C++ developer"
];
function subscribeReduced(cb) {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    mq.addEventListener("change", cb);
    return ()=>mq.removeEventListener("change", cb);
}
function readReduced() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function CinematicHero({ images }) {
    _s();
    const [idx, setIdx] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [playing, setPlaying] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const reducedMotion = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSyncExternalStore"])(subscribeReduced, readReduced, {
        "CinematicHero.useSyncExternalStore[reducedMotion]": ()=>false
    }["CinematicHero.useSyncExternalStore[reducedMotion]"]);
    const slides = buildHeroSlides(images);
    const safeIdx = Math.min(idx, Math.max(0, slides.length - 1));
    const current = slides[safeIdx];
    const sectionRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const stageRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const meshRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const cursorRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const segFillRefs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])([]);
    const goToRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({
        "CinematicHero.useRef[goToRef]": ()=>{}
    }["CinematicHero.useRef[goToRef]"]);
    const playingRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(true);
    const reducedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const slidesLenRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(slides.length);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CinematicHero.useEffect": ()=>{
            slidesLenRef.current = slides.length;
        }
    }["CinematicHero.useEffect"], [
        slides.length
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CinematicHero.useEffect": ()=>{
            const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            reducedRef.current = reduced;
            playingRef.current = !reduced;
            let idxNow = 0;
            let acc = 0;
            let heroVisible = true;
            let last = performance.now();
            let tx = 0;
            let ty = 0;
            let cx = 0;
            let cy = 0;
            let gx = window.innerWidth / 2;
            let gy = window.innerHeight / 3;
            const paintSegments = {
                "CinematicHero.useEffect.paintSegments": ()=>{
                    const n = slidesLenRef.current;
                    for(let k = 0; k < n; k++){
                        const el = segFillRefs.current[k];
                        if (!el) continue;
                        el.style.width = k < idxNow ? "100%" : k > idxNow ? "0%" : `${Math.min(1, acc / DUR) * 100}%`;
                    }
                }
            }["CinematicHero.useEffect.paintSegments"];
            const goTo = {
                "CinematicHero.useEffect.goTo": (i)=>{
                    const n = slidesLenRef.current;
                    if (!n) return;
                    idxNow = (i % n + n) % n;
                    acc = 0;
                    setIdx(idxNow);
                    paintSegments();
                }
            }["CinematicHero.useEffect.goTo"];
            goToRef.current = goTo;
            const onMouseMove = {
                "CinematicHero.useEffect.onMouseMove": (e)=>{
                    tx = e.clientX / window.innerWidth - 0.5;
                    ty = e.clientY / window.innerHeight - 0.5;
                }
            }["CinematicHero.useEffect.onMouseMove"];
            let alive = true;
            let raf = 0;
            const loop = {
                "CinematicHero.useEffect.loop": (now)=>{
                    if (!alive) return;
                    raf = requestAnimationFrame(loop);
                    const dt = Math.min(50, now - last);
                    last = now;
                    if (playingRef.current && heroVisible && !document.hidden && !reducedRef.current) {
                        acc += dt;
                        if (acc >= DUR) goTo(idxNow + 1);
                    }
                    paintSegments();
                    if (!reducedRef.current) {
                        cx += (tx - cx) * 0.06;
                        cy += (ty - cy) * 0.06;
                        if (stageRef.current) {
                            stageRef.current.style.transform = `rotateY(${cx * 1.6}deg) rotateX(${-cy * 1.6}deg)`;
                        }
                        if (meshRef.current) {
                            meshRef.current.style.transform = `translate3d(${cx * -14}px,${cy * -10}px,0)`;
                        }
                        gx += (tx * window.innerWidth + window.innerWidth / 2 - gx) * 0.12;
                        gy += (ty * window.innerHeight + window.innerHeight / 3 - gy) * 0.12;
                        if (cursorRef.current) {
                            cursorRef.current.style.left = `${gx}px`;
                            cursorRef.current.style.top = `${gy}px`;
                        }
                    } else {
                        acc = DUR * (slidesLenRef.current ? 1 : 0); // static full segment
                    }
                }
            }["CinematicHero.useEffect.loop"];
            const io = new IntersectionObserver({
                "CinematicHero.useEffect": ([e])=>{
                    heroVisible = e.isIntersecting;
                }
            }["CinematicHero.useEffect"], {
                threshold: 0
            });
            if (sectionRef.current) io.observe(sectionRef.current);
            if (!reduced) window.addEventListener("mousemove", onMouseMove, {
                passive: true
            });
            raf = requestAnimationFrame(loop);
            return ({
                "CinematicHero.useEffect": ()=>{
                    alive = false;
                    cancelAnimationFrame(raf);
                    io.disconnect();
                    window.removeEventListener("mousemove", onMouseMove);
                }
            })["CinematicHero.useEffect"];
        }
    }["CinematicHero.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CinematicHero.useEffect": ()=>{
            playingRef.current = playing && !reducedMotion;
        }
    }["CinematicHero.useEffect"], [
        playing,
        reducedMotion
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        ref: sectionRef,
        id: "about",
        className: "hero-x relative flex min-h-[100svh] items-center overflow-hidden border-b border-line",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: meshRef,
                className: "hx-mesh",
                "aria-hidden": "true"
            }, void 0, false, {
                fileName: "[project]/src/components/landing/cinematic-hero.tsx",
                lineNumber: 211,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "hx-grid",
                "aria-hidden": "true"
            }, void 0, false, {
                fileName: "[project]/src/components/landing/cinematic-hero.tsx",
                lineNumber: 212,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "hx-vignette",
                "aria-hidden": "true"
            }, void 0, false, {
                fileName: "[project]/src/components/landing/cinematic-hero.tsx",
                lineNumber: 213,
                columnNumber: 7
            }, this),
            !reducedMotion && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "hx-scan",
                "aria-hidden": "true"
            }, void 0, false, {
                fileName: "[project]/src/components/landing/cinematic-hero.tsx",
                lineNumber: 214,
                columnNumber: 26
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "hx-bracket hx-bracket--tl",
                "aria-hidden": "true",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                    viewBox: "0 0 34 34",
                    fill: "none",
                    stroke: "currentColor",
                    strokeWidth: "1.4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M1 12V1h11"
                    }, void 0, false, {
                        fileName: "[project]/src/components/landing/cinematic-hero.tsx",
                        lineNumber: 217,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/landing/cinematic-hero.tsx",
                    lineNumber: 216,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/landing/cinematic-hero.tsx",
                lineNumber: 215,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "hx-bracket hx-bracket--br",
                "aria-hidden": "true",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                    viewBox: "0 0 34 34",
                    fill: "none",
                    stroke: "currentColor",
                    strokeWidth: "1.4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M1 12V1h11"
                    }, void 0, false, {
                        fileName: "[project]/src/components/landing/cinematic-hero.tsx",
                        lineNumber: 222,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/landing/cinematic-hero.tsx",
                    lineNumber: 221,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/landing/cinematic-hero.tsx",
                lineNumber: 220,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative z-10 mx-auto grid w-full max-w-[1400px] grid-cols-1 items-center gap-20 px-5 pb-32 pt-32 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 lg:pb-24 lg:pt-36",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "hero-eyebrow",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "he-dot",
                                        "aria-hidden": "true"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/cinematic-hero.tsx",
                                        lineNumber: 230,
                                        columnNumber: 13
                                    }, this),
                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$generated$2f$site$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["site"].availability
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/landing/cinematic-hero.tsx",
                                lineNumber: 229,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "hero-title mt-8",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "ht-line",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "ht-inner",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("em", {
                                                    className: "accent-em",
                                                    children: "Mathematics"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/landing/cinematic-hero.tsx",
                                                    lineNumber: 237,
                                                    columnNumber: 17
                                                }, this),
                                                " and intelligence"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/landing/cinematic-hero.tsx",
                                            lineNumber: 236,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/cinematic-hero.tsx",
                                        lineNumber: 235,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "ht-line",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "ht-inner",
                                            children: [
                                                "for",
                                                " ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "ht-teal",
                                                    children: "complex systems"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/landing/cinematic-hero.tsx",
                                                    lineNumber: 243,
                                                    columnNumber: 17
                                                }, this),
                                                " —"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/landing/cinematic-hero.tsx",
                                            lineNumber: 241,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/cinematic-hero.tsx",
                                        lineNumber: 240,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "ht-line",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "ht-inner",
                                            children: [
                                                "from ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("em", {
                                                    className: "violet-em",
                                                    children: "molecules"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/landing/cinematic-hero.tsx",
                                                    lineNumber: 248,
                                                    columnNumber: 22
                                                }, this),
                                                " to machines."
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/landing/cinematic-hero.tsx",
                                            lineNumber: 247,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/cinematic-hero.tsx",
                                        lineNumber: 246,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/landing/cinematic-hero.tsx",
                                lineNumber: 234,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "hx-mono mt-7 font-mono text-sm sm:text-base",
                                children: [
                                    "Building as ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                        children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$generated$2f$content$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["profile"].name
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/cinematic-hero.tsx",
                                        lineNumber: 254,
                                        columnNumber: 25
                                    }, this),
                                    " — ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-cyan",
                                        children: "> "
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/cinematic-hero.tsx",
                                        lineNumber: 254,
                                        columnNumber: 49
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$typed$2d$text$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TypedText"], {
                                        phrases: typedRoles,
                                        className: "text-cyan"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/cinematic-hero.tsx",
                                        lineNumber: 255,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/landing/cinematic-hero.tsx",
                                lineNumber: 253,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "hx-lede mt-5 max-w-xl text-[17px] leading-[1.72]",
                                children: [
                                    "I hold an M.Sc. in Computer Engineering (AI & Robotics) from Ferdowsi University of Mashhad — building",
                                    " ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "hl",
                                        children: "mathematically-grounded ML systems"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/cinematic-hero.tsx",
                                        lineNumber: 261,
                                        columnNumber: 13
                                    }, this),
                                    " spanning",
                                    " ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "hl",
                                        children: "molecular & biological modeling"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/cinematic-hero.tsx",
                                        lineNumber: 262,
                                        columnNumber: 13
                                    }, this),
                                    ", materials, and ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "hl",
                                        children: "distributed intelligence"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/cinematic-hero.tsx",
                                        lineNumber: 263,
                                        columnNumber: 17
                                    }, this),
                                    "."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/landing/cinematic-hero.tsx",
                                lineNumber: 258,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-9 flex flex-wrap gap-3.5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: "/resume",
                                        className: "btn-hx-solid",
                                        children: [
                                            "Download CV ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUpRight$3e$__["ArrowUpRight"], {
                                                size: 16
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/landing/cinematic-hero.tsx",
                                                lineNumber: 268,
                                                columnNumber: 27
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/landing/cinematic-hero.tsx",
                                        lineNumber: 267,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: "/connect",
                                        className: "btn-hx-ghost",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2d$clock$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CalendarClock$3e$__["CalendarClock"], {
                                                size: 15
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/landing/cinematic-hero.tsx",
                                                lineNumber: 271,
                                                columnNumber: 15
                                            }, this),
                                            " Book a call"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/landing/cinematic-hero.tsx",
                                        lineNumber: 270,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        href: "#research",
                                        className: "btn-hx-ghost",
                                        children: [
                                            "View Research ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                size: 15
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/landing/cinematic-hero.tsx",
                                                lineNumber: 274,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/landing/cinematic-hero.tsx",
                                        lineNumber: 273,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/landing/cinematic-hero.tsx",
                                lineNumber: 266,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "hx-stats mt-12",
                                children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$generated$2f$content$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["stats"].map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "hx-stat",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                children: s.value
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/landing/cinematic-hero.tsx",
                                                lineNumber: 281,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: s.label
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/landing/cinematic-hero.tsx",
                                                lineNumber: 282,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, s.label, true, {
                                        fileName: "[project]/src/components/landing/cinematic-hero.tsx",
                                        lineNumber: 280,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/components/landing/cinematic-hero.tsx",
                                lineNumber: 278,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/landing/cinematic-hero.tsx",
                        lineNumber: 228,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        ref: stageRef,
                        className: "hx-stage",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "hx-orb hx-orb--1",
                                "aria-hidden": "true"
                            }, void 0, false, {
                                fileName: "[project]/src/components/landing/cinematic-hero.tsx",
                                lineNumber: 290,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "hx-orb hx-orb--2",
                                "aria-hidden": "true"
                            }, void 0, false, {
                                fileName: "[project]/src/components/landing/cinematic-hero.tsx",
                                lineNumber: 291,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "hx-orb hx-orb--3",
                                "aria-hidden": "true"
                            }, void 0, false, {
                                fileName: "[project]/src/components/landing/cinematic-hero.tsx",
                                lineNumber: 292,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "frame-wrap",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "frame",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "frame-window",
                                            children: slides.map((s, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: `frame-img ${i === safeIdx ? "is-active" : ""}`,
                                                    "aria-hidden": i !== safeIdx,
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "frame-zoom",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                            src: s.src,
                                                            alt: "",
                                                            fill: true,
                                                            sizes: "(max-width: 1024px) 86vw, 34vw",
                                                            priority: i === 0,
                                                            className: "object-cover"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/landing/cinematic-hero.tsx",
                                                            lineNumber: 304,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/landing/cinematic-hero.tsx",
                                                        lineNumber: 303,
                                                        columnNumber: 21
                                                    }, this)
                                                }, s.src, false, {
                                                    fileName: "[project]/src/components/landing/cinematic-hero.tsx",
                                                    lineNumber: 298,
                                                    columnNumber: 19
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/landing/cinematic-hero.tsx",
                                            lineNumber: 296,
                                            columnNumber: 15
                                        }, this),
                                        current && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "frame-meta",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "frame-index",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                            children: String(safeIdx + 1).padStart(2, "0")
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/landing/cinematic-hero.tsx",
                                                            lineNumber: 320,
                                                            columnNumber: 21
                                                        }, this),
                                                        "/",
                                                        String(slides.length).padStart(2, "0")
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/landing/cinematic-hero.tsx",
                                                    lineNumber: 319,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                    children: [
                                                        current.tag,
                                                        " — ",
                                                        current.title
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/landing/cinematic-hero.tsx",
                                                    lineNumber: 323,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "frame-progress",
                                                    role: "tablist",
                                                    "aria-label": "Hero scenes",
                                                    children: slides.map((s, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            role: "tab",
                                                            "aria-selected": i === safeIdx,
                                                            "aria-label": `Scene ${i + 1}: ${s.title}`,
                                                            className: `frame-seg ${i === safeIdx ? "on" : ""}`,
                                                            onClick: ()=>goToRef.current(i),
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                ref: (el)=>{
                                                                    segFillRefs.current[i] = el;
                                                                }
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/landing/cinematic-hero.tsx",
                                                                lineNumber: 341,
                                                                columnNumber: 25
                                                            }, this)
                                                        }, s.src, false, {
                                                            fileName: "[project]/src/components/landing/cinematic-hero.tsx",
                                                            lineNumber: 332,
                                                            columnNumber: 23
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/landing/cinematic-hero.tsx",
                                                    lineNumber: 326,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/landing/cinematic-hero.tsx",
                                            lineNumber: 318,
                                            columnNumber: 17
                                        }, this),
                                        slides.length > 1 && !reducedMotion && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            className: "frame-toggle",
                                            "aria-label": playing ? "Pause slideshow" : "Play slideshow",
                                            onClick: ()=>setPlaying((v)=>!v),
                                            children: playing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pause$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pause$3e$__["Pause"], {
                                                size: 13
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/landing/cinematic-hero.tsx",
                                                lineNumber: 359,
                                                columnNumber: 30
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__["Play"], {
                                                size: 13
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/landing/cinematic-hero.tsx",
                                                lineNumber: 359,
                                                columnNumber: 52
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/landing/cinematic-hero.tsx",
                                            lineNumber: 353,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/landing/cinematic-hero.tsx",
                                    lineNumber: 295,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/landing/cinematic-hero.tsx",
                                lineNumber: 294,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/landing/cinematic-hero.tsx",
                        lineNumber: 289,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/landing/cinematic-hero.tsx",
                lineNumber: 226,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "hx-scrollhint",
                "aria-hidden": "true",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: "SCROLL"
                    }, void 0, false, {
                        fileName: "[project]/src/components/landing/cinematic-hero.tsx",
                        lineNumber: 368,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "hx-scrollline"
                    }, void 0, false, {
                        fileName: "[project]/src/components/landing/cinematic-hero.tsx",
                        lineNumber: 369,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/landing/cinematic-hero.tsx",
                lineNumber: 367,
                columnNumber: 7
            }, this),
            !reducedMotion && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: cursorRef,
                className: "hx-cursor-glow",
                "aria-hidden": "true"
            }, void 0, false, {
                fileName: "[project]/src/components/landing/cinematic-hero.tsx",
                lineNumber: 371,
                columnNumber: 26
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/landing/cinematic-hero.tsx",
        lineNumber: 205,
        columnNumber: 5
    }, this);
}
_s(CinematicHero, "eMY9RhQzLmxedh5wE0UXP0zTCgQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSyncExternalStore"]
    ];
});
_c = CinematicHero;
var _c;
__turbopack_context__.k.register(_c, "CinematicHero");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/landing/typed-text.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TypedText",
    ()=>TypedText
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
function TypedText({ phrases, className }) {
    _s();
    const [text, setText] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [i, setI] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [deleting, setDeleting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const timeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TypedText.useEffect": ()=>{
            const current = phrases[i % phrases.length];
            let delay = deleting ? 30 : 70;
            if (!deleting && text === current) {
                delay = 1900;
                timeRef.current = window.setTimeout({
                    "TypedText.useEffect": ()=>setDeleting(true)
                }["TypedText.useEffect"], delay);
                return ({
                    "TypedText.useEffect": ()=>{
                        if (timeRef.current) clearTimeout(timeRef.current);
                    }
                })["TypedText.useEffect"];
            }
            if (deleting && text === "") {
                timeRef.current = window.setTimeout({
                    "TypedText.useEffect": ()=>{
                        setDeleting(false);
                        setI({
                            "TypedText.useEffect": (v)=>(v + 1) % phrases.length
                        }["TypedText.useEffect"]);
                    }
                }["TypedText.useEffect"], 350);
                return ({
                    "TypedText.useEffect": ()=>{
                        if (timeRef.current) clearTimeout(timeRef.current);
                    }
                })["TypedText.useEffect"];
            }
            timeRef.current = window.setTimeout({
                "TypedText.useEffect": ()=>setText(current.slice(0, text.length + (deleting ? -1 : 1)))
            }["TypedText.useEffect"], delay);
            return ({
                "TypedText.useEffect": ()=>{
                    if (timeRef.current) clearTimeout(timeRef.current);
                }
            })["TypedText.useEffect"];
        }
    }["TypedText.useEffect"], [
        text,
        deleting,
        i,
        phrases
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: className,
        children: [
            text,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "ml-0.5 inline-block w-[2px] animate-pulse-soft bg-cyan",
                style: {
                    height: "1em"
                }
            }, void 0, false, {
                fileName: "[project]/src/components/landing/typed-text.tsx",
                lineNumber: 44,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/landing/typed-text.tsx",
        lineNumber: 42,
        columnNumber: 5
    }, this);
}
_s(TypedText, "8xxs8XJPOsfsLie6sxye47ujPY0=");
_c = TypedText;
var _c;
__turbopack_context__.k.register(_c, "TypedText");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/site/mouse-glow.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MouseGlow",
    ()=>MouseGlow
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
function MouseGlow() {
    _s();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MouseGlow.useEffect": ()=>{
            const onMove = {
                "MouseGlow.useEffect.onMove": (e)=>{
                    const target = e.target;
                    const el = target?.closest?.("[data-glow]");
                    if (!el) return;
                    const r = el.getBoundingClientRect();
                    el.style.setProperty("--mx", `${(e.clientX - r.left) / r.width * 100}%`);
                    el.style.setProperty("--my", `${(e.clientY - r.top) / r.height * 100}%`);
                }
            }["MouseGlow.useEffect.onMove"];
            document.addEventListener("mousemove", onMove, {
                passive: true
            });
            return ({
                "MouseGlow.useEffect": ()=>document.removeEventListener("mousemove", onMove)
            })["MouseGlow.useEffect"];
        }
    }["MouseGlow.useEffect"], []);
    return null;
}
_s(MouseGlow, "OD7bBpZva5O2jO+Puf00hKivP7c=");
_c = MouseGlow;
var _c;
__turbopack_context__.k.register(_c, "MouseGlow");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/three/tilt.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Tilt",
    ()=>Tilt
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
function Tilt({ children, className, max = 6 }) {
    _s();
    const ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const onMove = (e)=>{
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        el.style.transform = `perspective(1200px) rotateY(${px * max}deg) rotateX(${-py * max}deg) scale(1.02)`;
    };
    const onLeave = ()=>{
        const el = ref.current;
        if (!el) return;
        el.style.transform = "perspective(1200px) rotateY(0deg) rotateX(0deg) scale(1)";
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        onPointerMove: onMove,
        onPointerLeave: onLeave,
        className: className ?? "",
        style: {
            transform: "perspective(1200px)",
            transition: "transform 150ms ease-out"
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/three/tilt.tsx",
        lineNumber: 32,
        columnNumber: 5
    }, this);
}
_s(Tilt, "QMBuJFIdzLIeqBcFwhMf246mjOM=");
_c = Tilt;
var _c;
__turbopack_context__.k.register(_c, "Tilt");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/stagger.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Stagger",
    ()=>Stagger
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
function Stagger({ children, className }) {
    _s();
    const ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Stagger.useEffect": ()=>{
            const el = ref.current;
            if (!el) return;
            const io = new IntersectionObserver({
                "Stagger.useEffect": ([entry])=>{
                    if (entry.isIntersecting) {
                        el.classList.add("in");
                        io.disconnect();
                    }
                }
            }["Stagger.useEffect"], {
                threshold: 0.08,
                rootMargin: "0px 0px -40px 0px"
            });
            io.observe(el);
            return ({
                "Stagger.useEffect": ()=>io.disconnect()
            })["Stagger.useEffect"];
        }
    }["Stagger.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: className,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/ui/stagger.tsx",
        lineNumber: 31,
        columnNumber: 5
    }, this);
}
_s(Stagger, "8uVE59eA/r6b92xF80p7sH8rXLk=");
_c = Stagger;
var _c;
__turbopack_context__.k.register(_c, "Stagger");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/timeline-fill.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TimelineFill",
    ()=>TimelineFill
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
function TimelineFill({ children }) {
    _s();
    const rootRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const fillRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TimelineFill.useEffect": ()=>{
            const root = rootRef.current;
            const fill = fillRef.current;
            if (!root || !fill) return;
            const update = {
                "TimelineFill.useEffect.update": ()=>{
                    const r = root.getBoundingClientRect();
                    const vh = window.innerHeight;
                    const p = Math.min(1, Math.max(0, (vh * 0.75 - r.top) / r.height));
                    fill.style.height = `${p * 100}%`;
                    root.querySelectorAll(".tl-node").forEach({
                        "TimelineFill.useEffect.update": (node)=>{
                            const nr = node.getBoundingClientRect();
                            node.classList.toggle("filled", nr.top - r.top <= p * r.height);
                        }
                    }["TimelineFill.useEffect.update"]);
                }
            }["TimelineFill.useEffect.update"];
            update();
            window.addEventListener("scroll", update, {
                passive: true
            });
            window.addEventListener("resize", update);
            return ({
                "TimelineFill.useEffect": ()=>{
                    window.removeEventListener("scroll", update);
                    window.removeEventListener("resize", update);
                }
            })["TimelineFill.useEffect"];
        }
    }["TimelineFill.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: rootRef,
        className: "tl",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "tl-track",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    ref: fillRef,
                    className: "tl-fill"
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/timeline-fill.tsx",
                    lineNumber: 37,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/ui/timeline-fill.tsx",
                lineNumber: 36,
                columnNumber: 7
            }, this),
            children
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/timeline-fill.tsx",
        lineNumber: 35,
        columnNumber: 5
    }, this);
}
_s(TimelineFill, "0oSBkaEa18ZopSOqbEYW6kdbW8c=");
_c = TimelineFill;
var _c;
__turbopack_context__.k.register(_c, "TimelineFill");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/content-types.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "domainColors",
    ()=>domainColors,
    "lucideIconRegistry",
    ()=>lucideIconRegistry
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$brain$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Brain$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/brain.mjs [app-client] (ecmascript) <export default as Brain>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cpu$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Cpu$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/cpu.mjs [app-client] (ecmascript) <export default as Cpu>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$flask$2d$conical$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FlaskConical$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/flask-conical.mjs [app-client] (ecmascript) <export default as FlaskConical>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$hexagon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Hexagon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/hexagon.mjs [app-client] (ecmascript) <export default as Hexagon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$magnet$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Magnet$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/magnet.mjs [app-client] (ecmascript) <export default as Magnet>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$network$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Network$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/network.mjs [app-client] (ecmascript) <export default as Network>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$scan$2d$line$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ScanLine$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/scan-line.mjs [app-client] (ecmascript) <export default as ScanLine>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sigma$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sigma$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sigma.mjs [app-client] (ecmascript) <export default as Sigma>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sparkles.mjs [app-client] (ecmascript) <export default as Sparkles>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$workflow$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Workflow$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/workflow.mjs [app-client] (ecmascript) <export default as Workflow>");
;
const domainColors = {
    cyan: "#3be1ff",
    violet: "#a78bfa",
    magenta: "#f472b6",
    emerald: "#34d399",
    amber: "#fbbf24"
};
const lucideIconRegistry = {
    Brain: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$brain$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Brain$3e$__["Brain"],
    Cpu: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cpu$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Cpu$3e$__["Cpu"],
    FlaskConical: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$flask$2d$conical$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FlaskConical$3e$__["FlaskConical"],
    Hexagon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$hexagon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Hexagon$3e$__["Hexagon"],
    Magnet: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$magnet$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Magnet$3e$__["Magnet"],
    Network: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$network$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Network$3e$__["Network"],
    ScanLine: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$scan$2d$line$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ScanLine$3e$__["ScanLine"],
    Sigma: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sigma$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sigma$3e$__["Sigma"],
    Sparkles: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"],
    Workflow: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$workflow$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Workflow$3e$__["Workflow"]
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/data.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// Barrels the editable content data. Values live in src/lib/generated/content.ts
// (compiled from content/data/content.json by scripts/generate-content.mjs).
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$content$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/content-types.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$generated$2f$content$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/generated/content.ts [app-client] (ecmascript)");
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/generated/content.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// AUTO-GENERATED by scripts/generate-content.mjs — do not edit.
// Source of truth: content/data/content.json (managed via the /admin panel).
__turbopack_context__.s([
    "awards",
    ()=>awards,
    "certifications",
    ()=>certifications,
    "domains",
    ()=>domains,
    "education",
    ()=>education,
    "experience",
    ()=>experience,
    "languages",
    ()=>languages,
    "marqueeDomains",
    ()=>marqueeDomains,
    "profile",
    ()=>profile,
    "projects",
    ()=>projects,
    "publications",
    ()=>publications,
    "services",
    ()=>services,
    "skills",
    ()=>skills,
    "stats",
    ()=>stats
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$brain$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Brain$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/brain.mjs [app-client] (ecmascript) <export default as Brain>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cpu$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Cpu$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/cpu.mjs [app-client] (ecmascript) <export default as Cpu>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$magnet$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Magnet$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/magnet.mjs [app-client] (ecmascript) <export default as Magnet>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$network$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Network$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/network.mjs [app-client] (ecmascript) <export default as Network>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$scan$2d$line$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ScanLine$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/scan-line.mjs [app-client] (ecmascript) <export default as ScanLine>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sigma$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sigma$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sigma.mjs [app-client] (ecmascript) <export default as Sigma>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$workflow$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Workflow$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/workflow.mjs [app-client] (ecmascript) <export default as Workflow>");
;
const I = {
    Brain: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$brain$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Brain$3e$__["Brain"],
    Cpu: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cpu$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Cpu$3e$__["Cpu"],
    Magnet: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$magnet$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Magnet$3e$__["Magnet"],
    Network: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$network$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Network$3e$__["Network"],
    ScanLine: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$scan$2d$line$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ScanLine$3e$__["ScanLine"],
    Sigma: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sigma$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sigma$3e$__["Sigma"],
    Workflow: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$workflow$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Workflow$3e$__["Workflow"]
};
const domains = [
    {
        id: "ml",
        label: "Machine Learning",
        short: "ML",
        blurb: "Neural networks, statistical learning, and predictive modeling with Python and R.",
        level: 4,
        heat: 4,
        color: "cyan",
        icon: I.Cpu,
        keywords: [
            "machine learning",
            "neural network",
            "deep learning",
            "python",
            "statistics"
        ]
    },
    {
        id: "mp",
        label: "Message Passing",
        short: "MP",
        blurb: "Belief propagation and message-passing algorithms for probabilistic inference on graphical models.",
        level: 3,
        heat: 4,
        color: "violet",
        icon: I.Magnet,
        keywords: [
            "message passing",
            "belief propagation",
            "probabilistic",
            "inference"
        ]
    },
    {
        id: "opt",
        label: "Optimization",
        short: "Optimization",
        blurb: "Genetic algorithms, proximal methods, and convex and nonconvex optimization for scientific problems.",
        level: 4,
        heat: 4,
        color: "emerald",
        icon: I.Sigma,
        keywords: [
            "optimization",
            "genetic algorithm",
            "proximal",
            "nonconvex"
        ]
    },
    {
        id: "anomaly",
        label: "Anomaly Detection",
        short: "Anomaly",
        blurb: "Compression-based and statistical techniques for detecting anomalies in complex data.",
        level: 3,
        heat: 3,
        color: "magenta",
        icon: I.ScanLine,
        keywords: [
            "anomaly",
            "compression",
            "outlier",
            "detection"
        ]
    },
    {
        id: "distributed",
        label: "Big Data & Distributed Systems",
        short: "Distributed",
        blurb: "Large-scale data processing and distributed computing architectures.",
        level: 3,
        heat: 3,
        color: "amber",
        icon: I.Network,
        keywords: [
            "big data",
            "distributed",
            "parallel",
            "processing"
        ]
    },
    {
        id: "math",
        label: "Mathematics & Statistics",
        short: "Mathematics",
        blurb: "Linear algebra, probability, and statistics as the foundations of data science and machine learning.",
        level: 5,
        heat: 4,
        color: "cyan",
        icon: I.Brain,
        keywords: [
            "linear algebra",
            "statistics",
            "probability",
            "mathematics"
        ]
    }
];
const marqueeDomains = domains.map((d)=>d.label);
const profile = {
    "name": "Yousof Ghalenoei",
    "firstName": "Yousof",
    "role": "M.Sc. in Computer Engineering",
    "degree": "M.Sc. in Computer Engineering — Artificial Intelligence & Robotics",
    "tagline": "Bridging machine learning, optimization, and mathematics.",
    "bio": [
        "I hold an M.Sc. in Computer Engineering (Artificial Intelligence & Robotics) from Ferdowsi University of Mashhad, where my thesis developed a single-class anomaly-detection framework based on an implicit convex hull and ensemble learning, supervised by Prof. Hadi Sadoghi Yazdi. I also hold a bachelor's degree in mathematics education from Shahid Beheshti University of Mashhad, and I studied computer engineering at the University of Bojnurd, North Khorasan.",
        "I have completed courses in paper writing, machine learning, statistics, and optimization from credible educational sources, and I carry out hands-on projects such as optimizing solar cells with the genetic algorithm. My work interests include neural networks, machine learning, reinforcement learning, big data processing, and distributed systems.",
        "I teach mathematics while pursuing research, and I am always open to research collaborations, academic exchanges, and opportunities that combine rigorous mathematics with real-world engineering."
    ],
    "focus": "Recently completed: M.Sc. thesis on single-class anomaly detection via an implicit convex hull and ensemble learning — combining elastic-net regularization, proximal methods, and Kalman-based approximate message passing (KAMP/DKAMP)."
};
const stats = [
    {
        "value": "3",
        "label": "Degrees"
    },
    {
        "value": "4",
        "label": "Years of teaching"
    },
    {
        "value": "5",
        "label": "Programming languages"
    },
    {
        "value": "3",
        "label": "Research interests"
    }
];
const education = [
    {
        "period": "2022 — 2025",
        "title": "M.Sc. in Computer Engineering — Artificial Intelligence & Robotics",
        "org": "Ferdowsi University of Mashhad, Iran",
        "detail": "Graduated with the grade Excellent (19.5/20). Thesis: “Single-class anomaly detection based on implicit convex hull and ensemble learning” — an elastic-net-regularized one-class framework solved with proximal methods and Kalman-based approximate message passing (KAMP), with a distributed variant (DKAMP). Advisor: Prof. Hadi Sadoghi Yazdi.",
        "tags": [
            "Anomaly Detection",
            "Machine Learning",
            "Optimization"
        ],
        "highlight": true
    },
    {
        "period": "2018 — 2022",
        "title": "B.Sc. in Mathematics Education",
        "org": "Shahid Beheshti University of Mashhad, Iran",
        "detail": "Government-funded bachelor's degree in mathematics education, graduated with a GPA of 17.56/20. Served as the secretary of the university's mathematics scientific association.",
        "tags": [
            "Mathematics",
            "Education",
            "Statistics"
        ]
    },
    {
        "period": "2017 — 2019",
        "title": "B.Sc. in Computer Engineering (studied)",
        "org": "University of Bojnurd, Iran",
        "detail": "Computer engineering studies at the University of Bojnurd (government-funded) in North Khorasan, with a GPA of 17/20.",
        "tags": [
            "Programming",
            "Computer Science",
            "Linear Algebra"
        ]
    }
];
const experience = [
    {
        "period": "Feb 2022 — Present",
        "title": "Mathematics Teacher",
        "org": "Ministry of Education, Bojnurd, Iran",
        "detail": "Teaching mathematics at the secondary level under the Iranian Ministry of Education in Bojnurd, North Khorasan.",
        "tags": [
            "Teaching",
            "Mathematics"
        ],
        "highlight": true
    },
    {
        "period": "2019 — 2021",
        "title": "Secretary, Mathematics Scientific Association",
        "org": "Shahid Beheshti University of Mashhad",
        "detail": "Organized seminars, workshops, and academic events for the university's mathematics scientific association.",
        "tags": [
            "Leadership",
            "Mathematics",
            "Events"
        ]
    },
    {
        "period": "2017 — 2020",
        "title": "Freelance Programmer",
        "org": "Freelance",
        "detail": "Developed software and data solutions in Python, R, C++, and PHP on a freelance basis.",
        "tags": [
            "Python",
            "R",
            "C++",
            "PHP"
        ]
    }
];
const publications = [
    {
        "title": "Single-Class Anomaly Detection via Implicit Convex Hull and Ensemble Learning",
        "authors": "Y. Ghalenoei, H. Sadoghi Yazdi",
        "venue": "M.Sc. Thesis — Ferdowsi University of Mashhad",
        "year": "2025",
        "status": "under-review",
        "tags": [
            "Anomaly Detection",
            "One-Class Classification",
            "Proximal Methods"
        ],
        "cite": "Sample entry — replace with the real citation"
    },
    {
        "title": "Kalman-Based Approximate Message Passing for Online Anomaly Scoring",
        "authors": "Y. Ghalenoei, H. Sadoghi Yazdi",
        "venue": "Preprint (sample)",
        "year": "2025",
        "status": "preprint",
        "tags": [
            "Message Passing",
            "Kalman Filter",
            "AMP"
        ],
        "cite": "Sample entry — replace with the real citation"
    },
    {
        "title": "Genetic-Algorithm Optimization of Solar-Cell Parameters",
        "authors": "Y. Ghalenoei",
        "venue": "Technical report (sample)",
        "year": "2024",
        "status": "published",
        "tags": [
            "Genetic Algorithm",
            "Optimization",
            "Photovoltaics"
        ],
        "cite": "Sample entry — replace with the real citation"
    },
    {
        "title": "Compression-Based Outlier Detection on Industrial Time Series",
        "authors": "Y. Ghalenoei",
        "venue": "Working paper (sample)",
        "year": "2023",
        "status": "in-press",
        "tags": [
            "Anomaly Detection",
            "Time Series",
            "Compression"
        ],
        "cite": "Sample entry — replace with the real citation"
    }
];
const awards = [];
const certifications = [
    {
        "year": "—",
        "title": "Courses in paper writing, machine learning, statistics, and optimization",
        "org": "Credible educational sources"
    }
];
const skills = [
    {
        "name": "Programming Languages",
        "skills": [
            {
                "name": "Python",
                "level": 90
            },
            {
                "name": "R",
                "level": 85
            },
            {
                "name": "C++",
                "level": 70
            },
            {
                "name": "PHP",
                "level": 65
            },
            {
                "name": "Git",
                "level": 80
            },
            {
                "name": "LaTeX",
                "level": 75
            }
        ]
    },
    {
        "name": "Mathematical Foundations",
        "skills": [
            {
                "name": "Linear Algebra",
                "level": 85
            },
            {
                "name": "Statistics",
                "level": 80
            },
            {
                "name": "Machine Learning",
                "level": 85
            },
            {
                "name": "Optimization",
                "level": 80
            }
        ]
    },
    {
        "name": "Research Interests",
        "skills": [
            {
                "name": "Message Passing",
                "level": 70
            },
            {
                "name": "Compression-Based Anomaly Detection",
                "level": 70
            },
            {
                "name": "Proximal Methods for Nonconvex Systems",
                "level": 65
            },
            {
                "name": "Genetic Algorithms",
                "level": 80
            }
        ]
    },
    {
        "name": "Languages",
        "skills": [
            {
                "name": "Persian (Farsi) — Native",
                "level": 100
            },
            {
                "name": "English — Reading",
                "level": 80
            },
            {
                "name": "English — Writing",
                "level": 75
            },
            {
                "name": "English — Speaking & Listening",
                "level": 75
            }
        ]
    }
];
const languages = [
    {
        "name": "Persian (Farsi)",
        "level": "Native",
        "percentage": 100
    },
    {
        "name": "English",
        "level": "Working proficiency (reading, writing, speaking, listening)",
        "percentage": 75
    }
];
const projects = [
    {
        "slug": "single-class-anomaly-detection",
        "title": "Single-Class Anomaly Detection via Implicit Convex Hull",
        "subtitle": "M.Sc. thesis — implicit convex hull, ensemble learning, and Kalman-based message passing",
        "summary": "A one-class classification framework that estimates the normal-data decision boundary through an elastic-net-regularized implicit convex hull, solved with proximal gradient methods and approximate message passing (AMP), extended to Kalman-based AMP (KAMP) and its distributed variant (DKAMP) for stability and scalability.",
        "year": "2025",
        "status": "complete",
        "domain": "Anomaly Detection",
        "domainColor": "magenta",
        "tags": [
            "Anomaly Detection",
            "One-Class Classification",
            "AMP",
            "Ensemble Learning"
        ],
        "tech": [
            "Python",
            "R"
        ],
        "cover": "/covers/single-class-anomaly-detection.svg",
        "featured": true
    },
    {
        "slug": "solar-cells-genetic-optimization",
        "title": "Optimization of Solar Cells Using Genetic Algorithm",
        "subtitle": "Evolutionary optimization of solar-cell parameters",
        "summary": "An optimization project that applies the genetic algorithm to tune solar-cell parameters for improved performance. Commissioned by Dr. Memar and implemented in Python and R.",
        "year": "",
        "status": "complete",
        "domain": "Optimization",
        "domainColor": "emerald",
        "tags": [
            "Genetic Algorithm",
            "Optimization",
            "Python",
            "R"
        ],
        "tech": [
            "Python",
            "R"
        ],
        "cover": "/covers/solar-cells-genetic-optimization.svg",
        "featured": true
    }
];
const services = [
    {
        icon: I.Cpu,
        title: "Machine Learning & Data Analysis",
        blurb: "Python and R pipelines for machine learning, statistics, and data-driven insight — from exploratory analysis to practical models."
    },
    {
        icon: I.Sigma,
        title: "Optimization & Algorithms",
        blurb: "Genetic algorithms, proximal methods, and bespoke optimization for engineering and scientific problems."
    },
    {
        icon: I.ScanLine,
        title: "Anomaly Detection",
        blurb: "Compression-based and statistical methods for detecting anomalies in industrial and scientific data."
    },
    {
        icon: I.Network,
        title: "Software Development",
        blurb: "Solid development in Python, R, C++, and PHP with Git-based collaboration and LaTeX documentation."
    },
    {
        icon: I.Brain,
        title: "Mathematics Teaching & Tutoring",
        blurb: "High-school and university mathematics instruction, exam preparation, and curriculum support."
    },
    {
        icon: I.Workflow,
        title: "Academic & Research Writing",
        blurb: "Persian and English paper writing, editing, and LaTeX typesetting for academic publications."
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_0_9u_zd._.js.map