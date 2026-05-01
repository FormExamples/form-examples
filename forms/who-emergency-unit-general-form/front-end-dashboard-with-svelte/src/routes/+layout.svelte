<script lang="ts">
  import '../app.css';
  let { children } = $props();
</script>

<svelte:head>
  <title>WHO Emergency Unit Form: General — Clinician Dashboard</title>
</svelte:head>

{@render children()}
