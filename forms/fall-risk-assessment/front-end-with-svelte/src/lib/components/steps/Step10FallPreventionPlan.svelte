<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import type { FallPreventionPlan } from '#lib/engine/types.js';

	const p = assessment.data.preventionPlan;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];

	type Field = Exclude<keyof FallPreventionPlan, 'planNotes'>;
	const questions: { field: Field; label: string }[] = [
		{ field: 'bedAlarm', label: 'Bed alarm in use / recommended?' },
		{ field: 'chairAlarm', label: 'Chair alarm in use / recommended?' },
		{ field: 'nonSlipFootwear', label: 'Non-slip footwear?' },
		{ field: 'hipProtectorsRecommended', label: 'Hip protectors recommended?' },
		{ field: 'exerciseProgramme', label: 'Exercise / strength + balance programme?' },
		{ field: 'vitaminDSupplement', label: 'Vitamin D supplementation?' },
		{ field: 'environmentalModifications', label: 'Environmental modifications recommended?' },
		{ field: 'medicationDeprescribing', label: 'Medication deprescribing planned?' },
		{ field: 'carerEducationProvided', label: 'Carer education provided?' }
	];
</script>

<Fieldset legend="Fall Prevention Plan">
	<p class="hint">Planned and recommended interventions going forward.</p>

	{#each questions as q (q.field)}
		<Field label={q.label}>
			<RadioGroup label={q.label}>
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name={q.field} value={opt.value} bind:group={p[q.field]} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	{/each}

	<Field label="Plan notes" inputId="planNotes">
		<TextAreaInput id="planNotes" label="Plan notes" rows={4} placeholder="Specific actions, owners, and follow-up dates…" bind:value={p.planNotes} />
	</Field>
</Fieldset>
