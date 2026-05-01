<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<svelte:head>
	<title>DVLA B1 Form — Clinician Dashboard</title>
</svelte:head>

{@render children()}
