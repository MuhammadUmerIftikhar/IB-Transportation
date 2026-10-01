/**
 * Inlined into the HTML just before the splash screen, so it runs before first paint:
 * repeat visits in the same browser session get the short splash (html[data-splash="fast"]).
 */
export const splashBootScript = `try{if(sessionStorage.getItem("ib-splash-seen")==="1")document.documentElement.dataset.splash="fast";sessionStorage.setItem("ib-splash-seen","1")}catch(e){}`;
