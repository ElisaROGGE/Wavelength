<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { themes } from "../../utils/themes";
  import { gameStore } from "../../lib/game/gameStore";
  import type { Player } from "../../lib/game/types";

  let angle = 0;
  let dragging = false;
  let center = { x: 0, y: 0 };
  let dialEl: HTMLDivElement;

  let targetAngle = 0;
  let targetVisible = true;
  let darkMode = false;
  let points = 0;
  let hasAnswered = false;
  let roundScore = 0;

  const RED_ZONE = 23;
  const YELLOW_ZONE = 13;
  const BLUE_ZONE = 5;

  let players: Player[] = [];
  let currentPlayerIndex = 0;
  $: currentPlayer = players[currentPlayerIndex];

  const unsubscribe = gameStore.subscribe((s) => (players = s.players));

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
    document.startViewTransition(() => {
      darkMode = !darkMode;
    });
  }

  onMount(() => {
    updateCenter();
    window.addEventListener("resize", updateCenter);
    setRandomTarget();
    setRandomTheme();
  });

  onDestroy(() => {
    window.removeEventListener("resize", updateCenter);
    unsubscribe();
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
    const p = e instanceof TouchEvent ? e.touches[0] : (e as MouseEvent);
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

  let streak = 0;

  function calculatePoints() {
    const diff = Math.abs(angle - targetAngle);
    let roundPoints = 0;

    if (diff <= BLUE_ZONE) {
      roundPoints = 3;
      streak += 1;
    } else if (diff <= YELLOW_ZONE) {
      roundPoints = 2;
      streak = 0;
    } else if (diff <= RED_ZONE) {
      roundPoints = 1;
      streak = 0;
    } else {
      roundPoints = 0;
      streak = 0;
      points = Math.max(0, points - 1);
    }

    const multiplier = 1 + Math.floor(streak / 2);
    const totalPoints = roundPoints * multiplier;
    points += totalPoints;
    return totalPoints;
  }

  function validateAnswer() {
    if (hasAnswered || players.length === 0) return;
    const earned = calculatePoints();
    roundScore = earned;
    // mettre à jour le score dans le store
    gameStore.updatePlayerScore(currentPlayerIndex, earned);
    hasAnswered = true;
    toggleTargetVisibility();
  }

  function nextTurn() {
    hasAnswered = false;
    angle = 0;
    streak = 0;
    setRandomTarget();
    setRandomTheme();
    if (players.length > 0) {
      currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    }
  }

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
    {darkMode ? "Light mode" : "Dark mode"}
  </button>

  <h2>Wavelength — Wheel</h2>

  <div class="players-row">
    {#if players.length > 0}
      <div class="current-player">
        Joueur actuel : <strong>{currentPlayer?.name}</strong> — Score : {currentPlayer?.score}
      </div>
      <ul class="players-list">
        {#each players as p, i}
          <li class:selected={i === currentPlayerIndex}>{p.name}: {p.score}</li>
        {/each}
      </ul>
    {:else}
      <p>
        Aucun joueur disponible. Retournez à l'accueil pour ajouter des joueurs.
      </p>
    {/if}
  </div>

  <div class="dial" bind:this={dialEl}>
    {#if targetVisible}
      <div
        class="target-area"
        style="background: {targetGradient(targetAngle)}"
      ></div>
    {/if}
    <div
      class="needle-container"
      on:mousedown={startDrag}
      on:touchstart={startDrag}
    >
      <div class="needle" style="transform: rotate({angle}deg);"></div>
    </div>
  </div>

  <p class="themes">{currentTheme.left} - {currentTheme.right}</p>
  {#if hasAnswered}
    <p>Points du tour : +{roundScore}</p>
  {/if}

  {#if streak > 1}
    <p class="streak">Série Bleue : x{1 + Math.floor(streak / 2)}</p>
  {/if}

  <div class="controls">
    <button on:click={nextTurn} disabled={!hasAnswered}>Next round</button>
    <button on:click={toggleTargetVisibility}>
      {targetVisible ? "Hide" : "Show target area"}
    </button>
    <button on:click={setRandomTheme}>Change theme</button>
    <button disabled={hasAnswered} on:click={validateAnswer}> Validate </button>
  </div>
</div>

<style>
  /* ...existing global styles from le cadran ... */
  .container {
    text-align: center;
    padding-top: 40px;
    font-family: "Poppins", sans-serif;
    height: 100vh;
  }

  h2 {
    font-size: 2rem;
    margin-bottom: 18px;
  }

  .players-row {
    display: flex;
    gap: 1.2rem;
    justify-content: center;
    align-items: center;
    margin-bottom: 14px;
    flex-wrap: wrap;
  }

  .players-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    gap: 10px;
  }

  .players-list li {
    padding: 6px 10px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.06);
  }

  .players-list li.selected {
    box-shadow: 0 6px 20px rgba(108, 92, 231, 0.3);
    background: linear-gradient(
      90deg,
      rgba(108, 92, 231, 0.12),
      rgba(165, 94, 234, 0.08)
    );
  }

  /* Dial styles (transplanted) */
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

  .themes {
    margin-top: 12px;
    font-size: 1.1rem;
    opacity: 0.9;
  }

  .controls {
    margin-top: 12px;
    display: flex;
    gap: 8px;
    justify-content: center;
  }

  /* dark mode */
  :global(body) {
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
