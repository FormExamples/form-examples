<script lang="ts">
	let {
		class: className = '',
		label,
		value = $bindable(''),
		required = false,
		disabled = false,
		...restProps
	}: { label: string; value?: string; required?: boolean; disabled?: boolean; [key: string]: unknown } = $props();
</script>

<input class={`text-input ${className}`} type="text" aria-label={label} bind:value {required} {disabled} {...restProps} />
