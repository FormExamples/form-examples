<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<svelte:head>
	<title>UK DVLA V1 Form — Clinician Dashboard</title>
</svelte:head>

{@render children()}
