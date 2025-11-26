<script lang="ts">
  import Header from "../lib/components/Header.svelte";
</script>

<Header />

<slot />

<style>
  :global(body) {
    margin: 0;
    font-family: "Poppins", system-ui, sans-serif;
    background: #f7f7fb;
    color: #111;
  }

  /* espace entre header et contenu */
  :global(main),
  :global(.home),
  :global(.container) {
    max-width: 980px;
    margin: 0 auto;
    padding: 20px;
  }
</style>
