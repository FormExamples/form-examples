<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<svelte:head>
	<title>Outpatient Outcome Report — Clinician Dashboard</title>
</svelte:head>

{@render children()}
