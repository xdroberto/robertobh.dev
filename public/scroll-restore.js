history.scrollRestoration = 'manual'
// Strip section anchors on first load so the browser doesn't snap past the hero
if (location.hash && !location.hash.startsWith('#/')) {
  history.replaceState(null, '', location.pathname + location.search)
}
window.scrollTo(0, 0)
