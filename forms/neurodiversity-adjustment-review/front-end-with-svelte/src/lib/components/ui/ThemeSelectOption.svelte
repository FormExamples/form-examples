<script lang="ts">
	// Lily Design System — ThemeSelectOption (headless).
	// A single <option class="theme-select-option"> for use inside ThemeSelect.
	import type { Snippet } from 'svelte';

	let {
		class: className = '',
		value,
		selected = false,
		disabled = false,
		children,
		...restProps
	}: {
		/** The theme value for this option. */
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
