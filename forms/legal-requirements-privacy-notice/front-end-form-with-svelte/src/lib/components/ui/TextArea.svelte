<script lang="ts">
	// TextArea — Lily Svelte headless contract.
	let {
		label,
		name,
		value = $bindable(''),
		placeholder = '',
		required = false,
		rows = 3
	}: {
		label: string;
		name: string;
		value: string;
		placeholder?: string;
		required?: boolean;
		rows?: number;
	} = $props();
</script>

<div class="field">
	<label class="label" for={name} data-required={required || undefined}>{label}</label>
	<textarea
		id={name}
		{name}
		{placeholder}
		{required}
		{rows}
		class="text-area-input"
		bind:value
	></textarea>
</div>
