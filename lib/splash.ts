/**
 * Inlined into the HTML just before the splash screen, so it runs before first paint and
 * before any other JavaScript loads. It drives the splash percentage from REAL loading:
 *
 *   - while the HTML is still arriving   →  5–25%
 *   - stylesheets, scripts, preloads, fonts and on-screen images finishing → 25–95%
 *   - the browser's `load` event (everything loaded) → 100%
 *
 * The number eases towards that target and never goes backwards. If nothing advances for
 * 4s, `data-slow` is set on #splash (shows a "slow connection" note); after 15s without the
 * page finishing, `data-stuck` is set (shows a "Continue to site" button).
 * `window.__ibSplashReady` resolves once 100% is shown — the splash leaves only then.
 *
 * Repeat visits in the same session also get html[data-splash="fast"] (shorter intro).
 */
export const splashBootScript = `(function () {
  var w = window, d = document, root = d.documentElement, perf = w.performance;
  try {
    if (sessionStorage.getItem("ib-splash-seen") === "1") root.dataset.splash = "fast";
    sessionStorage.setItem("ib-splash-seen", "1");
  } catch (e) {}
  var fast = root.dataset.splash === "fast";
  var loaded = d.readyState === "complete", shown = 0, gainMark = 0, seen = false, resolveReady;
  var start = perf.now(), lastGain = start;
  w.__ibSplashReady = new Promise(function (r) { resolveReady = r; });
  w.addEventListener("load", function () { loaded = true; });

  function finished(url) {
    try { return perf.getEntriesByName(new URL(url, location.href).href).length > 0; } catch (e) { return true; }
  }
  function target() {
    if (loaded) return 100;
    var total = 1, done = d.fonts && d.fonts.status === "loaded" ? 1 : 0, i, el;
    var list = d.querySelectorAll('link[rel="stylesheet"][href],link[rel="preload"][href],script[src]');
    for (i = 0; i < list.length; i++) { total++; if (finished(list[i].href || list[i].src)) done++; }
    for (i = 0; i < d.images.length; i++) {
      el = d.images[i];
      if (el.loading === "lazy") continue; // below-the-fold images load later on purpose
      total++; if (el.complete) done++;
    }
    var frac = done / total;
    return d.readyState === "loading" ? 5 + frac * 20 : 25 + frac * 70;
  }
  function tick() {
    var el = d.getElementById("splash");
    if (!el) { if (!seen) requestAnimationFrame(tick); return; }
    seen = true;
    var now = perf.now(), goal = target();
    var next = shown + (goal - shown) * (goal >= 100 ? (fast ? 0.35 : 0.2) : (fast ? 0.15 : 0.06));
    if (goal >= 100 && next > 99.5) next = 100;
    if (next > shown) shown = next;
    if (shown - gainMark >= 1) { gainMark = shown; lastGain = now; }
    el.style.setProperty("--splash-f", shown.toFixed(2));
    el.style.setProperty("--splash-p", String(Math.floor(shown)));
    if (!loaded && now - lastGain > 4000) el.setAttribute("data-slow", ""); else el.removeAttribute("data-slow");
    if (!loaded && now - start > 15000) el.setAttribute("data-stuck", "");
    if (shown >= 100) { el.removeAttribute("data-slow"); el.removeAttribute("data-stuck"); resolveReady(); return; }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();`;

declare global {
  interface Window {
    /** Set by splashBootScript: resolves when the splash shows 100% (page fully loaded). */
    __ibSplashReady?: Promise<void>;
  }
}
