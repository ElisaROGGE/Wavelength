<script lang="ts">
  import { goto } from "$app/navigation";

  export let title = "Wavelength";
</script>

<header class="site-header">
  <div class="inner">
    <h1 onclick={() => goto("/")} class="brand">{title}</h1>
    <nav class="nav">
      <a href="/">Home</a>
      <a href="/wheel">Wheel</a>
    </nav>
  </div>
</header>

<style>
  .site-header {
    width: 100%;
    background: linear-gradient(90deg, #6c5ce7, #a55eea);
    color: white;
    padding: 12px 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  }
  .inner {
    max-width: 980px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .brand {
    font-size: 1.1rem;
    margin: 0;
    font-weight: 700;
    cursor: pointer;
  }
  .nav a {
    color: rgba(255, 255, 255, 0.95);
    margin-left: 12px;
    text-decoration: none;
    font-weight: 600;
  }
  .nav a:hover {
    opacity: 0.9;
  }
</style>
