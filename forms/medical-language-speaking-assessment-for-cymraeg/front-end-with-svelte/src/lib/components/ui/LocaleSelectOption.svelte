<script lang="ts">
	// Lily Design System — LocaleSelectOption (headless).
	// A single <option class="theme-select-option"> for use inside LocaleSelect.
	import type { Snippet } from 'svelte';

	let {
		class: className = '',
		value,
		selected = false,
		disabled = false,
		children,
		...restProps
	}: {
		/** The locale value for this option. */
		value: string;
		/** Whether this option is pre-selected. */
		selected?: boolean;
		/** Whether this option is disabled. */
		disabled?: boolean;
		/** The option label content. */
		children: Snippet;
		[key: string]: unknown;
	} = $props();
</script>

<option class={`theme-select-option ${className}`} {value} {selected} {disabled} {...restProps}
	>{@render children?.()}</option
>
