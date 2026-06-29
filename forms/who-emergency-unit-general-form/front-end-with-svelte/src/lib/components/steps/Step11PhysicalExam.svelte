<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import type { PeEntry } from '$lib/engine/types';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Checkbox from '$lib/components/ui/Checkbox.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const pe = assessment.data.physicalExam;

	const systems: { key: keyof typeof pe; label: string }[] = [
		{ key: 'general', label: 'General' },
		{ key: 'neuroPsych', label: 'Neuro / Psych' },
		{ key: 'heent', label: 'HEENT' },
		{ key: 'neck', label: 'Neck' },
		{ key: 'respiratory', label: 'Respiratory' },
		{ key: 'cardiac', label: 'Cardiac' },
		{ key: 'abdominal', label: 'Abdominal' },
		{ key: 'pelvisGuRectal', label: 'Pelvis / GU / Rectal' },
		{ key: 'lymph', label: 'Lymph' },
		{ key: 'musculoskeletal', label: 'Musculoskeletal' },
		{ key: 'skin', label: 'Skin' }
	];
</script>

<Fieldset
	title="Physical Exam"
	description="For each of the 11 body systems: tick 'Normal' or describe findings (specify L or R if needed)."
>
	{#each systems as sys (sys.key)}
		{@const entry = pe[sys.key] as PeEntry}
		<div class="mb-4 rounded-lg border border-base-300 bg-base-200 p-3">
			<h4 class="mb-2 text-sm font-semibold text-base-content">{sys.label}</h4>
			<Checkbox label="Normal" name={`pe-${sys.key}-normal`} bind:checked={entry.normal} />
			{#if !entry.normal}
				<TextAreaInput
					label="Notes"
					name={`pe-${sys.key}-notes`}
					bind:value={entry.notes}
					rows={2}
				/>
			{/if}
		</div>
	{/each}
</Fieldset>
