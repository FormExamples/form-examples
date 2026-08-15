<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import MedicationEntry from '#lib/components/ui/MedicationEntry.svelte';
	import type { MedicationReview } from '#lib/engine/types.js';

	const m = assessment.data.medicationReview;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];

	type YesNoField = Exclude<keyof MedicationReview, 'medications' | 'medicationNotes'>;
	const classes: { field: YesNoField; label: string }[] = [
		{ field: 'polypharmacy', label: 'Polypharmacy (4 or more medications)?' },
		{ field: 'sedativesOrHypnotics', label: 'Sedatives or hypnotics (e.g. benzodiazepines, Z-drugs)?' },
		{ field: 'antihypertensives', label: 'Antihypertensives?' },
		{ field: 'diuretics', label: 'Diuretics?' },
		{ field: 'anticoagulants', label: 'Anticoagulants (e.g. warfarin, DOAC, heparin)?' },
		{ field: 'opioids', label: 'Opioids?' },
		{ field: 'antidepressants', label: 'Antidepressants?' },
		{ field: 'antipsychotics', label: 'Antipsychotics?' },
		{ field: 'recentMedicationChange', label: 'Recent medication change (last 4 weeks)?' }
	];
</script>

<Fieldset legend="Medication Review">
	<p class="hint">Current medications and high-risk drug classes for falls.</p>

	<Field label="Current medications" description="List all regular medications. Polypharmacy (≥4 medications) is a known fall-risk factor.">
		<MedicationEntry bind:medications={m.medications} />
	</Field>

	{#each classes as c (c.field)}
		<Field label={c.label}>
			<RadioGroup label={c.label}>
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name={c.field} value={opt.value} bind:group={m[c.field]} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	{/each}

	<Field label="Medication notes" inputId="medicationNotes">
		<TextAreaInput id="medicationNotes" label="Medication notes" rows={3} placeholder="Any concerns about adherence, side effects, or interactions…" bind:value={m.medicationNotes} />
	</Field>
</Fieldset>
