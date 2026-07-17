<script lang="ts">
	// Lily Design System — ThemeSelect (headless).
	// Mirrors the upstream lily-design-system-svelte-headless ThemeSelect: a
	// native <select class="theme-select"> for choosing a visual theme. The
	// consumer provides ThemeSelectOption children and applies the selected value
	// to the page. aria-label gives the control an accessible name.
	import type { Snippet } from 'svelte';

	let {
		class: className = '',
		label,
		value = $bindable(''),
		children,
		...restProps
	}: {
		/** Accessible label. */
		label: string;
		/** Selected theme. Bindable. */
		value?: string;
		/** ThemeSelectOption elements. */
		children: Snippet;
		[key: string]: unknown;
	} = $props();
</script>

<select class={`theme-select ${className}`} aria-label={label} bind:value {...restProps}>
	{@render children?.()}
</select>
