<script lang="ts">
  export let canValidate = false;
  export let canNext = false;

  export let onValidate: () => void;
  export let onNext: () => void;
  export let onToggleTarget: () => void;
</script>

<button disabled={!canValidate} on:click={onValidate}>
  Valider
</button>

<button disabled={!canNext} on:click={onNext}>
  Joueur suivant
</button>

<button on:click={onToggleTarget}>
  Hide / Show
</button>
