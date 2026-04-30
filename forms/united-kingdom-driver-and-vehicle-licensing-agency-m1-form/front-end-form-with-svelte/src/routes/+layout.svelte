<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<svelte:head>
	<title>DVLA M1 — Confidential Medical Information (Mental Health)</title>
</svelte:head>

{@render children()}
