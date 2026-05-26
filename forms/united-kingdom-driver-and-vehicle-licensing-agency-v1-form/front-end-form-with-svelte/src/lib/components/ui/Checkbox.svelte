<script lang="ts">
	// Legacy Checkbox adapted to emit Lily .checkbox-input + label markup.
	let {
		label,
		name,
		checked = $bindable(false),
		required = false
	}: {
		label: string;
		name: string;
		checked: boolean;
		required?: boolean;
	} = $props();
</script>

<label class="checkbox-row">
	<input
		id={name}
		{name}
		type="checkbox"
		{required}
		bind:checked
		class="checkbox-input"
	/>
	<span class="text">
		{label}
		{#if required}<span class="required">*</span>{/if}
	</span>
</label>

<style>
	.checkbox-row {
		display: flex; align-items: flex-start; gap: 0.5rem;
		padding: 0.5rem 0.75rem;
		border: 1px solid var(--color-border-strong);
		border-radius: 0.375rem;
		background: var(--color-surface);
		margin: 0 0 0.75rem;
		cursor: pointer;
	}
	.text { font-size: 0.9375rem; }
	.required { color: var(--color-danger); margin-left: 0.125rem; }
</style>
