<script lang="ts">
	// Legacy SectionCard adapted to emit Lily classes (.fieldset, .fieldset-legend, .hint).
	import type { Snippet } from 'svelte';

	let {
		title,
		description = '',
		children
	}: {
		title: string;
		description?: string;
		children: Snippet;
	} = $props();
</script>

<fieldset class="fieldset">
	<legend class="fieldset-legend">{title}</legend>
	{#if description}
		<p class="hint">{description}</p>
	{/if}
	{@render children()}
</fieldset>
