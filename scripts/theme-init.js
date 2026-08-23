/**
 * Theme-init snippet injected into the <head> of every exported HTML file by
 * export-static.mjs. It must run before first paint (no theme flash), which is
 * why it is plain script text rather than a React-rendered <script> tag
 * (React 19 does not execute those and warns about them).
 */
module.exports = `
try {
  var stored = localStorage.getItem("theme");
  var theme = stored || "light";
  document.documentElement.dataset.theme = theme;
} catch (e) { document.documentElement.dataset.theme = "light"; }
document.documentElement.classList.add("js");
/* Service worker: production hosts only — instant repeat visits + offline shell */
if (
  "serviceWorker" in navigator &&
  location.protocol === "https:" &&
  location.hostname.indexOf("localhost") === -1 &&
  location.hostname.indexOf("127.") !== 0
) {
  addEventListener("load", function () {
    navigator.serviceWorker.register("__SW_URL__").catch(function () {});
  });
}
`;
