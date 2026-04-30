<script lang="ts">
	import type { DassItem } from '$lib/engine/types';

	let {
		itemNumber,
		text,
		name,
		value = $bindable<DassItem>(null)
	}: {
		itemNumber: number;
		text: string;
		name: string;
		value: DassItem;
	} = $props();

	const options: { value: 0 | 1 | 2 | 3; label: string; sub: string }[] = [
		{ value: 0, label: '0', sub: 'Did not apply to me at all' },
		{ value: 1, label: '1', sub: 'Applied to me to some degree, or some of the time' },
		{
			value: 2,
			label: '2',
			sub: 'Applied to me to a considerable degree, or a good part of time'
		},
		{ value: 3, label: '3', sub: 'Applied to me very much, or most of the time' }
	];

	function selectValue(v: 0 | 1 | 2 | 3) {
		value = v;
	}
</script>

<fieldset class="mb-5 border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
	<legend class="mb-2 block text-sm font-medium text-gray-800">
		<span class="mr-1 inline-block w-7 text-gray-400">{itemNumber}.</span>{text}
	</legend>
	<div class="grid grid-cols-2 gap-2 sm:grid-cols-4">
		{#each options as opt (opt.value)}
			<label
				class="flex cursor-pointer flex-col items-center gap-0.5 rounded-lg border px-3 py-2 text-center transition-colors
					{value === opt.value
					? 'border-primary bg-blue-50 font-semibold'
					: 'border-gray-300 bg-white hover:bg-gray-50'}"
			>
				<input
					type="radio"
					{name}
					checked={value === opt.value}
					onchange={() => selectValue(opt.value)}
					class="sr-only"
				/>
				<span class="text-base font-bold">{opt.label}</span>
				<span class="text-xs text-gray-500">{opt.sub}</span>
			</label>
		{/each}
	</div>
</fieldset>
