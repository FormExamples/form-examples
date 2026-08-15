<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import type { EnvironmentalAssessment } from '#lib/engine/types.js';

	const e = assessment.data.environmental;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];

	type Field = Exclude<keyof EnvironmentalAssessment, 'environmentalNotes'>;
	const questions: { field: Field; label: string }[] = [
		{ field: 'loosThrowRugs', label: 'Loose throw rugs?' },
		{ field: 'clutteredWalkways', label: 'Cluttered walkways?' },
		{ field: 'poorLighting', label: 'Poor lighting (especially at night)?' },
		{ field: 'stairsWithoutHandrails', label: 'Stairs without handrails?' },
		{ field: 'bathroomGrabBarsAbsent', label: 'Bathroom grab bars absent?' },
		{ field: 'unsuitableFootwear', label: 'Unsuitable footwear?' },
		{ field: 'bedHeightProblem', label: 'Bed height problem (too high or too low)?' },
		{ field: 'hipProtectorsUsed', label: 'Hip protectors currently used?' }
	];
</script>

<Fieldset legend="Environmental Assessment">
	<p class="hint">Home or ward hazards that may contribute to falls.</p>

	{#each questions as q (q.field)}
		<Field label={q.label}>
			<RadioGroup label={q.label}>
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name={q.field} value={opt.value} bind:group={e[q.field]} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	{/each}

	<Field label="Environmental notes" inputId="environmentalNotes">
		<TextAreaInput id="environmentalNotes" label="Environmental notes" rows={3} bind:value={e.environmentalNotes} />
	</Field>
</Fieldset>
