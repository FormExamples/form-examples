<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<svelte:head>
	<title>WHO Counter-Referral Form — Clinician Dashboard</title>
</svelte:head>

{@render children()}
