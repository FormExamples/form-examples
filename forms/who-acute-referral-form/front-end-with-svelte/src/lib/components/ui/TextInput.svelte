<script lang="ts">
	// TextInput — Lily Svelte headless contract.
	//
	// Renders a Lily .field wrapper around a Lily .text-input (or .date-input,
	// .email-input, .tel-input, .datetime-local) so the shared stylesheet
	// styles every variant identically. Keeps the legacy `name` and
	// `placeholder` API used by the step components.
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
		type?: 'text' | 'date' | 'datetime-local' | 'email' | 'tel';
	} = $props();

	const inputClass = $derived.by(() => {
		switch (type) {
			case 'date':
				return 'date-input';
			case 'datetime-local':
				return 'date-input';
			case 'email':
				return 'email-input';
			case 'tel':
				return 'tel-input';
			default:
				return 'text-input';
		}
	});
</script>

<div class="field">
	<label class="label" for={name} data-required={required || undefined}>{label}</label>
	<input
		id={name}
		{name}
		{type}
		{placeholder}
		{required}
		class={inputClass}
		bind:value
	/>
</div>
