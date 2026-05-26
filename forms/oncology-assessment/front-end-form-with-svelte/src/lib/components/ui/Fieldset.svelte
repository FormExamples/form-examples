<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		class: className = '',
		legend,
		disabled = false,
		children,
		...restProps
	}: {
		legend: string;
		disabled?: boolean;
		children: Snippet;
		[key: string]: unknown;
	} = $props();
</script>

<fieldset class={`fieldset ${className}`} {disabled} {...restProps}>
	<legend class="fieldset-legend">{legend}</legend>
	{@render children?.()}
</fieldset>
