<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<svelte:head>
	<title>UK DVLA V1 — Confidential Medical Information (Vision)</title>
</svelte:head>

{@render children()}
