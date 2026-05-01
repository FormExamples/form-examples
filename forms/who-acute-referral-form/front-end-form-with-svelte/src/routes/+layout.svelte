<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<svelte:head>
	<title>WHO Acute Referral Form</title>
</svelte:head>

{@render children()}
