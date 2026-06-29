<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import type { PreviousInterventions } from '$lib/engine/types';

	const p = assessment.data.previousInterventions;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];

	type Field = Exclude<keyof PreviousInterventions, 'interventionNotes'>;
	const questions: { field: Field; label: string }[] = [
		{ field: 'fallsClinicReferral', label: 'Falls clinic referral made?' },
		{ field: 'physiotherapyProvided', label: 'Physiotherapy provided?' },
		{ field: 'occupationalTherapyProvided', label: 'Occupational therapy provided?' },
		{ field: 'medicationReviewCompleted', label: 'Medication review completed in the last 12 months?' },
		{ field: 'homeSafetyAssessment', label: 'Home safety assessment completed?' },
		{ field: 'interventionDeclined', label: 'Has the patient declined a recommended intervention?' },
		{ field: 'missedReferral', label: 'Has a previous referral been missed (no-show / cancelled)?' }
	];
</script>

<Fieldset legend="Previous Interventions">
	<p class="hint">Fall-prevention interventions that have already been provided.</p>

	{#each questions as q (q.field)}
		<Field label={q.label}>
			<RadioGroup label={q.label}>
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name={q.field} value={opt.value} bind:group={p[q.field]} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	{/each}

	<Field label="Intervention notes" inputId="interventionNotes">
		<TextAreaInput id="interventionNotes" label="Intervention notes" rows={3} bind:value={p.interventionNotes} />
	</Field>
</Fieldset>
