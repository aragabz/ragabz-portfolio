// Lifecycle for the CSS aurora behind the hero (see HeroBackground.astro):
// pauses the drift animation while the hero is off-screen or the tab is
// hidden, and nudges one blob towards the pointer. Returns a cleanup function.

const DRIFT = 0.35; // fraction of the pointer offset the blob follows

export function mountHeroBackground(root: HTMLElement): () => void {
  const hero = root.parentElement ?? root;
  const pointerBlob = root.querySelector<HTMLElement>('.blob-pointer');

  let onScreen = true;
  function updatePaused() {
    root.classList.toggle('is-paused', !onScreen || document.hidden);
  }
  const visibilityObserver = new IntersectionObserver(([entry]) => {
    onScreen = entry.isIntersecting;
    updatePaused();
  });
  visibilityObserver.observe(root);
  document.addEventListener('visibilitychange', updatePaused);

  // Pointer drift only for real hover devices; touch screens skip it.
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  let frame = 0;
  let lastEvent: PointerEvent | undefined;
  const applyPointer = () => {
    frame = 0;
    if (!pointerBlob || !lastEvent || !onScreen) return;
    const rect = hero.getBoundingClientRect();
    const x = (lastEvent.clientX - rect.left - rect.width / 2) * DRIFT;
    const y = (lastEvent.clientY - rect.top - rect.height * 0.42) * DRIFT;
    pointerBlob.style.setProperty('--pointer-x', `${x.toFixed(1)}px`);
    pointerBlob.style.setProperty('--pointer-y', `${y.toFixed(1)}px`);
  };
  const onPointerMove = (e: PointerEvent) => {
    lastEvent = e;
    if (!frame) frame = requestAnimationFrame(applyPointer);
  };
  if (finePointer && pointerBlob) window.addEventListener('pointermove', onPointerMove, { passive: true });

  return () => {
    visibilityObserver.disconnect();
    document.removeEventListener('visibilitychange', updatePaused);
    window.removeEventListener('pointermove', onPointerMove);
    if (frame) cancelAnimationFrame(frame);
  };
}
