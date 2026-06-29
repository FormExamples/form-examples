<script lang="ts">
	// DateTimeInput — Lily Svelte headless contract.
	//
	// Emits: <input class="datetime-input" type="datetime-local">.
	let {
		class: className = '',
		label,
		value = $bindable(''),
		min = undefined,
		max = undefined,
		required = false,
		disabled = false,
		...restProps
	}: {
		label: string;
		value?: string;
		min?: string;
		max?: string;
		required?: boolean;
		disabled?: boolean;
		[key: string]: unknown;
	} = $props();
</script>

<input
	class={`datetime-input ${className}`}
	type="datetime-local"
	aria-label={label}
	bind:value
	{min}
	{max}
	{required}
	{disabled}
	{...restProps}
/>
