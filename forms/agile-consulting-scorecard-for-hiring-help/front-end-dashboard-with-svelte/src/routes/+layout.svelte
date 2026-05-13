<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<svelte:head>
	<title>Agile Consulting Scorecard — Dashboard</title>
</svelte:head>

{@render children()}
