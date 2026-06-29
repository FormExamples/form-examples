<script lang="ts">
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
		type?: 'text' | 'date' | 'email';
	} = $props();
</script>

<div class="mb-4">
	<label for={name} class="mb-1 block text-sm font-medium text-base-content/70">
		{label}
		{#if required}<span class="text-error">*</span>{/if}
	</label>
	<input
		id={name}
		{name}
		{type}
		{placeholder}
		{required}
		bind:value
		class="w-full rounded-lg border border-base-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
	/>
</div>
