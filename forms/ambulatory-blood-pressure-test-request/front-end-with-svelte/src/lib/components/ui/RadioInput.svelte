<script lang="ts">
	// RadioInput — Lily Svelte headless contract.
	//
	// Emits: <input class="radio-input" type="radio">.
	let {
		class: className = '',
		label,
		name = undefined,
		value = undefined,
		checked = false,
		disabled = false,
		...restProps
	}: {
		label: string;
		name?: string;
		value?: string;
		checked?: boolean;
		disabled?: boolean;
		[key: string]: unknown;
	} = $props();
</script>

<input
	class={`radio-input ${className}`}
	type="radio"
	aria-label={label}
	{name}
	{value}
	{checked}
	{disabled}
	{...restProps}
/>
