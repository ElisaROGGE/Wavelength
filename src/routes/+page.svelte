<script lang="ts">
  import { onDestroy } from "svelte";
  import { goto } from "$app/navigation";
  import { gameStore } from "../lib/game/gameStore";
  import type { Player } from "../lib/game/types";

  let name = "";
  let players: Player[] = [];

  const unsubscribe = gameStore.subscribe((s) => (players = s.players));

  function addPlayer() {
    const trimmed = name.trim();
    if (!trimmed) return;
    gameStore.addPlayer(trimmed);
    name = "";
  }

  function removePlayer(i: number) {
    gameStore.removePlayer(i);
  }

  async function startGame() {
    if (players.length === 0) return;
    await goto("/wheel");
  }

  onDestroy(() => unsubscribe());
</script>



<main class="home">
  <h1>Wavelength — Accueil</h1>

  <div class="form">
    <input
      placeholder="Nom du joueur"
      bind:value={name}
      on:keydown={(e) => e.key === "Enter" && addPlayer()}
    />
    <button on:click={addPlayer}>Ajouter</button>
  </div>

  {#if players.length > 0}
    <ul class="players">
      {#each players as p, i}
        <li>
          {p.name} <button on:click={() => removePlayer(i)}>Supprimer</button>
        </li>
      {/each}
    </ul>
  {:else}
    <p>Aucun joueur ajouté.</p>
  {/if}

  <div class="actions">
    <button on:click={startGame} disabled={players.length === 0}>
      Démarrer la partie
    </button>
  </div>
</main>

<style>
  .home {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 3rem 1rem;
    font-family: "Poppins", sans-serif;
  }

  h1 {
    margin-bottom: 1.5rem;
  }

  .form {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  input {
    padding: 0.6rem 0.8rem;
    border-radius: 8px;
    border: 1px solid #ccc;
    min-width: 220px;
  }

  button {
    padding: 0.6rem 0.9rem;
    border-radius: 8px;
    border: none;
    background: linear-gradient(135deg, #6c5ce7, #a55eea);
    color: white;
    cursor: pointer;
  }

  .players {
    list-style: none;
    padding: 0;
    margin: 0.8rem 0;
  }

  .players li {
    display: flex;
    gap: 0.6rem;
    align-items: center;
    margin-bottom: 0.4rem;
  }

  .actions {
    margin-top: 1.2rem;
  }
</style>
