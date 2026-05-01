<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<svelte:head>
	<title>WHO Prehospital Form</title>
</svelte:head>

{@render children()}
