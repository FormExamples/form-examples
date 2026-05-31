<script lang="ts">
	// Form — Lily Svelte headless contract.
	import type { Snippet } from 'svelte';

	let {
		class: className = '',
		label,
		onsubmit = undefined,
		children,
		...restProps
	}: {
		label: string;
		onsubmit?: (event: SubmitEvent) => void;
		children: Snippet;
		[key: string]: unknown;
	} = $props();

	function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		onsubmit?.(event);
	}
</script>

<form class={`form ${className}`} aria-label={label} onsubmit={handleSubmit} {...restProps}>
	{@render children?.()}
</form>
