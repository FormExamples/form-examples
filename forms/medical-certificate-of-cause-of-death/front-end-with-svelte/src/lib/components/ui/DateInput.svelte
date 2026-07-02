<script lang="ts">
	// DateInput — Lily Svelte headless contract.
	//
	// Emits: <input class="date-input" type="date">. Accepts a `type` override so
	// the same component also serves time inputs, and a nullable value so it can
	// bind directly to the model's `string | null` date / time fields.
	let {
		class: className = '',
		label,
		type = 'date',
		value = $bindable<string | null | undefined>(''),
		min = undefined,
		max = undefined,
		required = false,
		disabled = false,
		...restProps
	}: {
		label: string;
		type?: string;
		value?: string | null | undefined;
		min?: string;
		max?: string;
		required?: boolean;
		disabled?: boolean;
		[key: string]: unknown;
	} = $props();
</script>

<input
	class={`date-input ${className}`}
	{type}
	aria-label={label}
	bind:value
	{min}
	{max}
	{required}
	{disabled}
	{...restProps}
/>
