<script lang="ts">
  import '../app.css';
  let { children } = $props();
</script>

<svelte:head>
  <title>DVLA B1 — Confidential medical information (neurological)</title>
</svelte:head>

{@render children()}
