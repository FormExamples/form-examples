<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<svelte:head>
	<title>Outpatient Outcome Report</title>
</svelte:head>

{@render children()}
