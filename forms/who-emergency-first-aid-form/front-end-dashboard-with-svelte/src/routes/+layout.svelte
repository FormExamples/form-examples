<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<svelte:head>
	<title>WHO Emergency First Aid Form — Clinician Dashboard</title>
</svelte:head>

{@render children()}
