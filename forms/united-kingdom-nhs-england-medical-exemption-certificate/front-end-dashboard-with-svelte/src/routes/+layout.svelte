<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<svelte:head>
	<title>FP92A — Medical Exemption Certificate Dashboard</title>
</svelte:head>

{@render children()}
