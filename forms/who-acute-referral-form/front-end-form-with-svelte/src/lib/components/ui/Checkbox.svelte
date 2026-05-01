<script lang="ts">
	let {
		label,
		name,
		checked = $bindable(false)
	}: {
		label: string;
		name: string;
		checked: boolean;
	} = $props();
</script>

<label
	for={name}
	class="mb-3 flex cursor-pointer items-start gap-2 rounded-lg border px-3 py-2 text-sm transition-colors
		{checked ? 'border-primary bg-blue-50' : 'border-gray-300 bg-white hover:bg-gray-50'}"
>
	<input
		id={name}
		{name}
		type="checkbox"
		bind:checked
		class="mt-0.5 h-4 w-4 accent-primary"
	/>
	<span class="text-gray-800">{label}</span>
</label>
