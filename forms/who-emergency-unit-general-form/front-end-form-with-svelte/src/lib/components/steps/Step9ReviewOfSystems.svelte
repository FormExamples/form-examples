<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import type { RosEntry } from '$lib/engine/types';
	import SectionCard from '$lib/components/ui/SectionCard.svelte';
	import Checkbox from '$lib/components/ui/Checkbox.svelte';
	import TextArea from '$lib/components/ui/TextArea.svelte';

	const r = assessment.data.reviewOfSystems;

	const systems: { key: keyof typeof r; label: string }[] = [
		{ key: 'general', label: 'General' },
		{ key: 'heent', label: 'HEENT' },
		{ key: 'respiratory', label: 'Respiratory' },
		{ key: 'cardiovascular', label: 'Cardiovascular' },
		{ key: 'gastrointestinal', label: 'Gastrointestinal' },
		{ key: 'pelvisGuRectal', label: 'Pelvis / GU / Rectal' },
		{ key: 'femaleReproductive', label: 'Female Reproductive' },
		{ key: 'maleReproductive', label: 'Male Reproductive' },
		{ key: 'skin', label: 'Skin' },
		{ key: 'musculoskeletal', label: 'Musculoskeletal' },
		{ key: 'hematologic', label: 'Hematologic' },
		{ key: 'neurological', label: 'Neurological' },
		{ key: 'psychiatric', label: 'Psychiatric' },
		{ key: 'pediatricSpecific', label: 'Pediatric Specific (if applicable)' }
	];
</script>

<SectionCard
	title="Review of Systems"
	description="Tick 'Normal' or describe abnormal findings for each of the 14 systems."
>
	{#each systems as sys (sys.key)}
		{@const entry = r[sys.key] as RosEntry}
		<div class="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-3">
			<h4 class="mb-2 text-sm font-semibold text-gray-700">{sys.label}</h4>
			<Checkbox label="Normal" name={`ros-${sys.key}-normal`} bind:checked={entry.normal} />
			{#if !entry.normal}
				<TextArea
					label="Notes"
					name={`ros-${sys.key}-notes`}
					bind:value={entry.notes}
					rows={2}
				/>
			{/if}
		</div>
	{/each}
</SectionCard>
