<script lang="ts">
	// Legacy TextInput adapted to emit Lily .field + .label + .text-input markup.
	let {
		label,
		name,
		value = $bindable(''),
		placeholder = '',
		required = false,
		type = 'text'
	}: {
		label: string;
		name: string;
		value: string;
		placeholder?: string;
		required?: boolean;
		type?: 'text' | 'date' | 'email' | 'tel';
	} = $props();

	const inputClass = $derived(
		type === 'date' ? 'date-input' :
		type === 'email' ? 'email-input' :
		type === 'tel' ? 'tel-input' :
		'text-input'
	);
</script>

<div class="field" data-required={required || undefined}>
	<label class="label" for={name} data-required={required || undefined}>
		{label}
	</label>
	<input
		id={name}
		{name}
		{type}
		{placeholder}
		{required}
		bind:value
		class={inputClass}
	/>
</div>
