<script lang="ts">
  import '../app.css';
  let { children } = $props();
</script>

<svelte:head>
  <title>WHO Emergency Unit Form: Trauma — Clinician Dashboard</title>
</svelte:head>

{@render children()}
