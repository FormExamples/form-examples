<script lang="ts">
	// NumberInput — Lily Svelte headless contract.
	//
	// Emits: <input class="number-input" type="number">.
	let {
		class: className = '',
		label,
		value = $bindable<number | null | undefined>(null),
		min = undefined,
		max = undefined,
		step = undefined,
		required = false,
		disabled = false,
		...restProps
	}: {
		label: string;
		value?: number | null | undefined;
		min?: number;
		max?: number;
		step?: number | string;
		required?: boolean;
		disabled?: boolean;
		[key: string]: unknown;
	} = $props();
</script>

<input
	class={`number-input ${className}`}
	type="number"
	aria-label={label}
	bind:value
	{min}
	{max}
	{step}
	{required}
	{disabled}
	{...restProps}
/>
