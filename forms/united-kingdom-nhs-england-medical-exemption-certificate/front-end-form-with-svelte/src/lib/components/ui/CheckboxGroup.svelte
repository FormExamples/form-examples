<script lang="ts">
	interface Option {
		value: string;
		label: string;
		description?: string;
	}
	let {
		label,
		name,
		options,
		values = $bindable<string[]>([]),
		required = false
	}: {
		label: string;
		name: string;
		options: Option[];
		values: string[];
		required?: boolean;
	} = $props();

	function toggle(value: string) {
		if (values.includes(value)) {
			values = values.filter((v) => v !== value);
		} else {
			values = [...values, value];
		}
	}
</script>

<fieldset class="mb-4">
	<legend class="mb-2 block text-sm font-medium text-gray-700">
		{label}
		{#if required}<span class="text-red-500">*</span>{/if}
	</legend>
	<div class="space-y-2">
		{#each options as opt (opt.value)}
			<label
				class="flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-3 transition-colors
					{values.includes(opt.value)
					? 'border-primary bg-blue-50'
					: 'border-gray-300 bg-white hover:bg-gray-50'}"
			>
				<input
					type="checkbox"
					{name}
					value={opt.value}
					checked={values.includes(opt.value)}
					onchange={() => toggle(opt.value)}
					class="mt-1 text-primary accent-primary"
				/>
				<span class="text-sm">
					<span class="font-medium text-gray-900">{opt.label}</span>
					{#if opt.description}
						<span class="block text-xs text-gray-500">{opt.description}</span>
					{/if}
				</span>
			</label>
		{/each}
	</div>
</fieldset>
