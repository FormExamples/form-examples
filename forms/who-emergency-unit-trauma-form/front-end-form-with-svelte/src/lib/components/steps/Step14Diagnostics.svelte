<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import type { LabEntry, ImagingEntry } from '$lib/engine/types';
	import SectionCard from '$lib/components/ui/SectionCard.svelte';
	import Checkbox from '$lib/components/ui/Checkbox.svelte';
	import TextArea from '$lib/components/ui/TextArea.svelte';

	const d = assessment.data.diagnostics;

	const labs: { key: 'labHgb' | 'labBloodType' | 'labChemistry' | 'labHepatic' | 'labUpt' | 'labOther'; label: string }[] = [
		{ key: 'labHgb', label: 'Hgb (haemoglobin)' },
		{ key: 'labBloodType', label: 'Blood type' },
		{ key: 'labChemistry', label: 'Chemistry' },
		{ key: 'labHepatic', label: 'Hepatic panel' },
		{ key: 'labUpt', label: 'Urine pregnancy test (UPT)' },
		{ key: 'labOther', label: 'Other labs' }
	];

	const imaging: { key: 'imgChestRadiograph' | 'imgPelvicRadiograph' | 'imgHeadCt' | 'imgCspine' | 'imgChestAbdomenCt' | 'imgExtremityRadiograph' | 'imgOther'; label: string }[] = [
		{ key: 'imgChestRadiograph', label: 'Chest radiograph (CXR)' },
		{ key: 'imgPelvicRadiograph', label: 'Pelvic radiograph' },
		{ key: 'imgHeadCt', label: 'Head CT' },
		{ key: 'imgCspine', label: 'C-spine radiograph or CT' },
		{ key: 'imgChestAbdomenCt', label: 'Chest / abdomen CT' },
		{ key: 'imgExtremityRadiograph', label: 'Extremity radiograph' },
		{ key: 'imgOther', label: 'Other imaging' }
	];
</script>

<SectionCard
	title="Diagnostics"
	description="Tick the labs and imaging ordered, and record results when available."
>
	<h3 class="mb-2 text-base font-semibold text-gray-800">Labs ordered</h3>
	{#each labs as l (l.key)}
		{@const entry = d[l.key] as LabEntry}
		<div class="mb-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
			<Checkbox label={`Ordered: ${l.label}`} name={`${l.key}-ordered`} bind:checked={entry.ordered} />
			{#if entry.ordered}
				<TextArea label="Result" name={`${l.key}-result`} bind:value={entry.result} rows={2} />
			{/if}
		</div>
	{/each}

	<h3 class="mt-6 mb-2 text-base font-semibold text-gray-800">Imaging ordered</h3>
	{#each imaging as im (im.key)}
		{@const entry = d[im.key] as ImagingEntry}
		<div class="mb-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
			<Checkbox label={`Ordered: ${im.label}`} name={`${im.key}-ordered`} bind:checked={entry.ordered} />
			{#if entry.ordered}
				<TextArea label="Result" name={`${im.key}-result`} bind:value={entry.result} rows={2} />
			{/if}
		</div>
	{/each}
</SectionCard>
