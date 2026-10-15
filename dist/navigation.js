// Install synchronously in <head>, before page links become interactive.
// Own ordinary internal clicks; preserve intentional new-tab browser gestures.
(() => {
  if (window.renewNavigationInstalled) return;
  window.renewNavigationInstalled = true;
  window.addEventListener('click', event => {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const path = event.composedPath ? event.composedPath() : [event.target];
    const anchor = path.find(node => node?.matches?.('a[href]')) || event.target?.closest?.('a[href]');
    if (!anchor || anchor.hasAttribute('download')) return;
    let url;
    try { url = new URL(anchor.getAttribute('href'), location.href); } catch { return; }
    if (!['http:', 'https:'].includes(url.protocol)) return;
    if (url.origin !== location.origin && url.origin !== 'https://renew-india.dhruviv.chatgpt.site') return;
    // Canonical Site links also stay inside the current preview/hosting origin.
    const destination = url.pathname + url.search + url.hash;
    anchor.target = '_self';
    event.preventDefault();
    event.stopImmediatePropagation();
    location.assign(destination);
  }, true);
})();
