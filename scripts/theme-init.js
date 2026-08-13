/**
 * Theme-init snippet injected into the <head> of every exported HTML file by
 * export-static.mjs. It must run before first paint (no theme flash), which is
 * why it is plain script text rather than a React-rendered <script> tag
 * (React 19 does not execute those and warns about them).
 */
module.exports = `
try {
  var stored = localStorage.getItem("theme");
  var theme = stored || (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
  document.documentElement.dataset.theme = theme;
} catch (e) { document.documentElement.dataset.theme = "dark"; }
`;