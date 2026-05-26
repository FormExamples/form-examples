<script lang="ts">
	// DateInput — Lily Svelte headless contract.
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

<input class={`date-input ${className}`} type="date" aria-label={label} bind:value {min} {max} {required} {disabled} {...restProps} />
