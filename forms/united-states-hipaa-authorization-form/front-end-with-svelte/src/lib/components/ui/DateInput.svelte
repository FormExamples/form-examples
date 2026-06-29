<script lang="ts">
	// DateInput — Lily Svelte headless contract.
	//
	// Emits: <input class="date-input" type="date">.
	let {
		class: className = '',
		label,
		value = $bindable<string | null>(''),
		min = undefined,
		max = undefined,
		required = false,
		disabled = false,
		...restProps
	}: {
		label: string;
		value?: string | null;
		min?: string;
		max?: string;
		required?: boolean;
		disabled?: boolean;
		[key: string]: unknown;
	} = $props();
</script>

<input
	class={`date-input ${className}`}
	type="date"
	aria-label={label}
	bind:value
	{min}
	{max}
	{required}
	{disabled}
	{...restProps}
/>
