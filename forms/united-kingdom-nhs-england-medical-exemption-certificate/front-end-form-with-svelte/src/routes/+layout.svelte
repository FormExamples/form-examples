<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<svelte:head>
	<title>UK NHS England Medical Exemption Certificate (FP92A)</title>
</svelte:head>

{@render children()}
