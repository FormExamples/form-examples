<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import type { PeEntry } from '$lib/engine/types';
	import SectionCard from '$lib/components/ui/SectionCard.svelte';
	import Checkbox from '$lib/components/ui/Checkbox.svelte';
	import TextArea from '$lib/components/ui/TextArea.svelte';

	const pe = assessment.data.physicalExam;

	const systems: { key: 'general' | 'neuroPsych' | 'heent' | 'neck' | 'respiratory' | 'cardiac' | 'abdominal' | 'pelvis' | 'guRectal' | 'musculoskeletal' | 'skin'; label: string }[] = [
		{ key: 'general', label: 'General' },
		{ key: 'neuroPsych', label: 'Neuro / Psych' },
		{ key: 'heent', label: 'HEENT' },
		{ key: 'neck', label: 'Neck' },
		{ key: 'respiratory', label: 'Respiratory' },
		{ key: 'cardiac', label: 'Cardiac' },
		{ key: 'abdominal', label: 'Abdominal' },
		{ key: 'pelvis', label: 'Pelvis' },
		{ key: 'guRectal', label: 'GU / Rectal' },
		{ key: 'musculoskeletal', label: 'MSK (musculoskeletal)' },
		{ key: 'skin', label: 'Skin' }
	];
</script>

<SectionCard
	title="Physical Exam"
	description="For each of the 11 body systems: tick 'Normal' or describe findings (specify L or R if needed). Use the 'Detail area of injury' field to describe location of injuries (anterior / posterior body diagram)."
>
	{#each systems as sys (sys.key)}
		{@const entry = pe[sys.key] as PeEntry}
		<div class="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-3">
			<h4 class="mb-2 text-sm font-semibold text-gray-700">{sys.label}</h4>
			<Checkbox label="Normal" name={`pe-${sys.key}-normal`} bind:checked={entry.normal} />
			{#if !entry.normal}
				<TextArea
					label="Notes"
					name={`pe-${sys.key}-notes`}
					bind:value={entry.notes}
					rows={2}
				/>
			{/if}
		</div>
	{/each}

	<h3 class="mt-4 mb-2 text-base font-semibold text-gray-800">Detail area of injury</h3>
	<TextArea
		label="Describe location, side and depth of injuries (anterior / posterior body diagram)"
		name="areaOfInjuryDetail"
		bind:value={pe.areaOfInjuryDetail}
		rows={4}
	/>
</SectionCard>
