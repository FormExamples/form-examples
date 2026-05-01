<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<svelte:head>
	<title>UK DVLA M1 — Clinician Dashboard</title>
</svelte:head>

{@render children()}
