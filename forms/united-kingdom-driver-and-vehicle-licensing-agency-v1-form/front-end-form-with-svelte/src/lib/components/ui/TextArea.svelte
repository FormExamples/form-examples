<script lang="ts">
	// Legacy TextArea adapted to emit Lily .field + .label + .text-area-input markup.
	let {
		label,
		name,
		value = $bindable(''),
		placeholder = '',
		rows = 3,
		required = false
	}: {
		label: string;
		name: string;
		value: string;
		placeholder?: string;
		rows?: number;
		required?: boolean;
	} = $props();
</script>

<div class="field" data-required={required || undefined}>
	<label class="label" for={name} data-required={required || undefined}>
		{label}
	</label>
	<textarea
		id={name}
		{name}
		{placeholder}
		{rows}
		{required}
		bind:value
		class="text-area-input"
	></textarea>
</div>
