<script lang="ts">
	import type { Snippet } from 'svelte';
	let { class: className = '', label, onsubmit = undefined, onreset = undefined, children, ...restProps }: { label: string; onsubmit?: (event: SubmitEvent) => void; onreset?: (event: Event) => void; children: Snippet; [key: string]: unknown } = $props();
	function handleSubmit(event: SubmitEvent) { event.preventDefault(); onsubmit?.(event); }
</script>

<form class={`form ${className}`} aria-label={label} onsubmit={handleSubmit} {onreset} {...restProps}>{@render children?.()}</form>
