<script lang="ts">
	// Lily Design System — LocaleSelect (headless).
	// The i18n-pilot sibling of ThemeSelect: a native <select class="theme-select">
	// for choosing the UI language. Reuses the Lily theme-select styling so the two
	// nav switchers render identically. The consumer provides LocaleSelectOption
	// children and applies the selected value. aria-label gives it an accessible name.
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
		/** Selected locale. Bindable. */
		value?: string;
		/** LocaleSelectOption elements. */
		children: Snippet;
		[key: string]: unknown;
	} = $props();
</script>

<select class={`theme-select ${className}`} aria-label={label} bind:value {...restProps}>
	{@render children?.()}
</select>
