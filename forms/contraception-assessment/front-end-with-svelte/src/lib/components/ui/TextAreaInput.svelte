<script lang="ts">
	let {
		class: className = '',
		label,
		value = $bindable(''),
		rows = undefined,
		required = false,
		disabled = false,
		...restProps
	}: {
		label: string;
		value?: string;
		rows?: number;
		required?: boolean;
		disabled?: boolean;
		[key: string]: unknown;
	} = $props();
</script>

<textarea
	class={`text-area-input ${className}`}
	aria-label={label}
	bind:value
	{rows}
	{required}
	{disabled}
	{...restProps}
></textarea>
