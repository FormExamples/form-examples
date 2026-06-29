<script lang="ts">
	let {
		class: className = '',
		checked = $bindable(false),
		label,
		disabled = false,
		required = false,
		name = undefined,
		id = undefined,
		value = undefined,
		...restProps
	}: { checked?: boolean; label: string; disabled?: boolean; required?: boolean; name?: string; id?: string; value?: string; [key: string]: unknown } = $props();
</script>

<input class={`checkbox-input ${className}`} type="checkbox" bind:checked aria-label={label} {disabled} {required} {name} {id} {value} {...restProps} />
