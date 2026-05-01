<script lang="ts">
  import '../app.css';
  let { children } = $props();
</script>

<svelte:head>
  <title>WHO Emergency First Aid Form — patient questionnaire</title>
</svelte:head>

{@render children()}
