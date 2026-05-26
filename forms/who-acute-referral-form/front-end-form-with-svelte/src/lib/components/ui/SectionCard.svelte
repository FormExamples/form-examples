<script lang="ts">
	// SectionCard — Lily Svelte headless contract.
	//
	// Renders the form's section as a <fieldset class="fieldset"> with a
	// fieldset-legend so that the Lily HTML class contract applies. The
	// optional `description` becomes a Lily <p class="hint"> directly below
	// the legend.
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
