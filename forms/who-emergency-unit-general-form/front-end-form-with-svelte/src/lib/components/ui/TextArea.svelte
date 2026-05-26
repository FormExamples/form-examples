<script lang="ts">
	// TextArea — Lily Svelte headless contract.
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

<div class="field">
	<label class="label" for={name} data-required={required || undefined}>{label}</label>
	<textarea
		id={name}
		{name}
		{placeholder}
		{rows}
		{required}
		class="text-area-input"
		bind:value
	></textarea>
</div>
