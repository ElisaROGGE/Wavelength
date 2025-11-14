<script lang="ts">
  import { onMount } from "svelte";

  let angle = 0;
  let dragging = false;
  let center = { x: 0, y: 0 };
  let dialEl: HTMLDivElement;

  let targetAngle = 0;
  let targetVisible = true;
  let darkMode = false;
  $: {
    if (typeof document !== "undefined") {
      if (darkMode) document.body.classList.add("dark");
      else document.body.classList.remove("dark");
    }
  }

  function toggleDarkMode() {
    if (!document.startViewTransition) {
      darkMode = !darkMode;
      return;
    }

    // View Transition
    document.startViewTransition(() => {
      darkMode = !darkMode;
    });
  }

  onMount(() => {
    updateCenter();
    window.addEventListener("resize", updateCenter);

    setRandomTarget();
    setRandomTheme();

    return () => {
      window.removeEventListener("resize", updateCenter);
    };
  });

  function updateCenter() {
    const rect = dialEl.getBoundingClientRect();
    center = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height,
    };
  }

  function startDrag(e: MouseEvent | TouchEvent) {
    dragging = true;
    updateAngle(e);
  }

  function stopDrag() {
    dragging = false;
  }

  function updateAngle(e: MouseEvent | TouchEvent) {
    if (!dragging) return;

    const p = e instanceof TouchEvent ? e.touches[0] : e;

    const dx = p.clientX - center.x;
    const dy = p.clientY - center.y;

    let a = Math.atan2(dx, -dy) * (180 / Math.PI);

    a = Math.max(-90, Math.min(90, a));
    angle = a;
  }

  function setRandomTarget() {
    targetAngle = Math.random() * 180 - 90;
  }

  function toggleTargetVisibility() {
    targetVisible = !targetVisible;
  }

  const themes = [
    { left: "Bad super power", right: "Amazing super power" },
    { left: "Introvert", right: "Extremely sociable" },
    { left: "Very bad movie", right: "Absolute masterpiece" },
    { left: "Very healthy", right: "Extremely fatty" },
    { left: "Cute animal", right: "Nightmarish animal" },
  ];
  let currentTheme = themes[0];

  function setRandomTheme() {
    const index = Math.floor(Math.random() * themes.length);
    currentTheme = themes[index];
  }

  function targetGradient(angle: number) {
    return `
			conic-gradient(
				from -90deg at 50% 100%,
				#000 0deg ${angle - 22.5 + 90}deg,
				#ff6b6b ${angle - 22.5 + 90}deg ${angle - 13.5 + 90}deg,
				#feca57 ${angle - 13.5 + 90}deg ${angle - 4.5 + 90}deg,
				#48dbfb ${angle - 4.5 + 90}deg ${angle + 4.5 + 90}deg,
				#feca57 ${angle + 4.5 + 90}deg ${angle + 13.5 + 90}deg,
				#ff6b6b ${angle + 13.5 + 90}deg ${angle + 22.5 + 90}deg,
				#000 ${angle + 22.5 + 90}deg 180deg
			)
		`;
  }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class="container"
  on:mousemove={updateAngle}
  on:mouseup={stopDrag}
  on:touchmove={updateAngle}
  on:touchend={stopDrag}
>
  <button on:click={toggleDarkMode}>
    {darkMode ? "Mode clair" : "Mode nuit"}
  </button>

  <h2>Wavelength</h2>

  <div class="dial" bind:this={dialEl}>
    {#if targetVisible}
      <div
        class="target-area"
        style="background: {targetGradient(targetAngle)}"
      ></div>
    {/if}
    <div
      class="needle-container"
      id="needleContainer"
      on:mousedown={startDrag}
      on:touchstart={startDrag}
    >
      <div
        class="needle"
        id="needle"
        style="transform: rotate({angle}deg);"
      ></div>
    </div>
  </div>
  <p class="themes">{currentTheme.left} - {currentTheme.right}</p>

  <button
    on:click={() => {
      setRandomTarget();
      setRandomTheme();
    }}>Next round</button
  >
  <button on:click={toggleTargetVisibility}>
    {targetVisible ? "Hide" : "Show target area"}
  </button>
  <button on:click={setRandomTheme}>Change theme</button>

  <p>Needle: {Math.round(angle)}°</p>
  <p>TargetAngle: {Math.round(targetAngle)}°</p>
</div>

<style>
  /* --- GLOBAL --- */
  .container {
    text-align: center;
    padding-top: 40px;
    font-family: "Poppins", sans-serif;
    height: 100vh;
  }

  h2 {
    font-size: 2.2rem;
    font-weight: 600;
    margin-bottom: 30px;
    letter-spacing: 1px;
    text-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  /* --- DIAL --- */
  .dial {
    width: 420px;
    height: 220px;
    background: linear-gradient(to bottom, #1d1f27, #0f1014);
    border-radius: 220px 220px 0 0;
    position: relative;
    overflow: hidden;

    box-shadow:
      inset 0 15px 35px rgba(255, 255, 255, 0.15),
      inset 0 -10px 25px rgba(0, 0, 0, 0.4),
      0 15px 40px rgba(0, 0, 0, 0.6);

    margin: 0 auto;
    border: 6px solid rgba(255, 255, 255, 0.06);
  }

  .target-area {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    border-radius: inherit;
    filter: brightness(1.2) saturate(1.15);
    mix-blend-mode: screen;
  }

  /* --- NEEDLE --- */
  .needle-container {
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 0;
    height: 180px;
    transform: translateX(-50%);
    cursor: pointer;
  }

  .needle {
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 6px;
    height: 195px;

    background: linear-gradient(to bottom, #ff6b81, #d63031);
    border-radius: 4px;

    box-shadow:
      0 0 15px rgba(255, 70, 70, 0.6),
      0 0 40px rgba(255, 70, 70, 0.3);

    transform-origin: bottom center;
  }

  .needle-container::after {
    content: "";
    position: absolute;
    bottom: -6px;
    left: 50%;
    transform: translateX(-38%);
    width: 22px;
    height: 22px;
    background: radial-gradient(circle, #ffffff, #cccccc);
    border-radius: 50%;
    box-shadow:
      0 5px 12px rgba(0, 0, 0, 0.4),
      inset 0 2px 4px rgba(255, 255, 255, 0.9),
      inset 0 -3px 4px rgba(0, 0, 0, 0.3);
  }

  .themes {
    margin-top: 15px;
    font-size: 1.2rem;
    font-weight: 500;
    opacity: 0.85;
  }

  /* --- BUTTONS --- */
  button {
    margin-top: 20px;
    padding: 12px 22px;

    font-size: 1rem;
    border-radius: 10px;
    border: none;

    background: linear-gradient(135deg, #6c5ce7, #a55eea);
    color: white;
    font-weight: 600;

    cursor: pointer;
    transition: 0.2s ease;

    box-shadow:
      0 4px 15px rgba(108, 92, 231, 0.4),
      inset 0 2px 4px rgba(255, 255, 255, 0.4);
  }

  button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(108, 92, 231, 0.6);
  }

  p {
    margin-top: 10px;
    font-size: 1.1rem;
    opacity: 0.9;
  }

  :global(body) {
    transition:
      background 0.4s ease,
      color 0.4s ease;
    background: #f0f0f0;
    color: #111;
  }

  :global(body.dark) {
    background: #0e0f13;
    color: white;
  }

   ::view-transition-old(root) {
    animation: none;
    z-index: -1;
  }

  ::view-transition-new(root) {
    animation: unclip 1s;
    clip-path: polygon(-100vmax 100%, 100% 100%, 100% -100vmax);
  }

  @keyframes unclip {
    0% {
      clip-path: polygon(100% 100%, 100% 100%, 100% 100%);
    }
  }
</style>
