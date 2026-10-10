(() => {
  const button = document.querySelector("[data-platforms-toggle]");
  const track = document.querySelector(".platforms-track");
  if (!button || !track) return;

  const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
  const mobileViewport = window.matchMedia("(max-width: 980px)");
  let pausedByUser = false;

  const updateState = () => {
    const canAnimate = mobileViewport.matches && !motionPreference.matches;
    const isPlaying = canAnimate && !pausedByUser;
    track.classList.toggle("is-paused", !isPlaying);
    button.hidden = !canAnimate;
    button.setAttribute("aria-pressed", String(isPlaying));
    button.title = isPlaying
      ? "Mettre en pause le défilement"
      : "Reprendre le défilement";
  };

  button.addEventListener("click", () => {
    pausedByUser = !pausedByUser;
    updateState();
  });

  mobileViewport.addEventListener("change", updateState);
  motionPreference.addEventListener("change", updateState);
  updateState();
})();
