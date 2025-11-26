<script lang="ts">
  import { onMount } from "svelte";

  export let angle = 0;
  export let targetAngle = 0;
  export let targetVisible = true;

  let dragging = false;
  let center = { x: 0, y: 0 };
  let dialEl: HTMLDivElement;

  const RED_ZONE = 23;
  const YELLOW_ZONE = 13;
  const BLUE_ZONE = 5;

  onMount(() => {
    updateCenter();
    window.addEventListener("resize", updateCenter);
    return () => window.removeEventListener("resize", updateCenter);
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

  export function setRandomTarget() {
    targetAngle = Math.random() * 180 - 90;
  }

  export function toggleTargetVisibility() {
    targetVisible = !targetVisible;
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
  class="dial"
  bind:this={dialEl}
  on:mousemove={updateAngle}
  on:mouseup={stopDrag}
  on:touchmove={updateAngle}
  on:touchend={stopDrag}
>
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

<style>
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
</style>
