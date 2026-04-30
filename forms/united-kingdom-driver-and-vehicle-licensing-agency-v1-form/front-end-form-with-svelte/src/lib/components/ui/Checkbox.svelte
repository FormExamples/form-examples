<script lang="ts">
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

<div class="mb-4">
	<label
		class="flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors
			{checked
			? 'border-primary bg-blue-50'
			: 'border-gray-300 bg-white hover:bg-gray-50'}"
	>
		<input
			id={name}
			{name}
			type="checkbox"
			{required}
			bind:checked
			class="mt-1 h-4 w-4 accent-primary"
		/>
		<span class="text-sm text-gray-800">
			{label}
			{#if required}<span class="text-red-500">*</span>{/if}
		</span>
	</label>
</div>
