<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import MedicationEntry from '#lib/components/ui/MedicationEntry.svelte';
	import type { YesNo, MedicationReview } from '#lib/engine/types.js';

	const m = assessment.data.medicationReview;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];

	type MedFlagKey = {
		[K in keyof MedicationReview]: MedicationReview[K] extends YesNo ? K : never;
	}[keyof MedicationReview];

	const classes: { key: MedFlagKey; label: string }[] = [
		{ key: 'aceiArb', label: 'On ACEi or ARB?' },
		{ key: 'sglt2Inhibitor', label: 'On SGLT2 inhibitor?' },
		{ key: 'diuretic', label: 'On loop or thiazide diuretic?' },
		{ key: 'statin', label: 'On statin?' },
		{ key: 'phosphateBinder', label: 'On phosphate binder?' },
		{ key: 'erythropoietinAgent', label: 'On erythropoiesis-stimulating agent (ESA)?' }
	];
</script>

<Fieldset legend="Medication Review & Dose Adjustment">
	<p class="hint">Renal-relevant medications and any required dose adjustments.</p>

	<h3 class="subheading">Current medications</h3>
	<p class="hint">Include all systemic medications relevant to renal management.</p>
	<MedicationEntry bind:medications={m.currentMedications} />

	{#each classes as item (item.key)}
		<Field label={item.label}>
			<RadioGroup label={item.label}>
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name={item.key} value={opt.value} bind:group={m[item.key]} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	{/each}

	<Field label="Are dose adjustments needed for renal impairment?">
		<RadioGroup label="Are dose adjustments needed for renal impairment?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="doseAdj" value={opt.value} bind:group={m.doseAdjustmentsNeeded} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if m.doseAdjustmentsNeeded === 'yes'}
		<Field label="Dose adjustment details" inputId="doseAdjustmentDetails">
			<TextAreaInput id="doseAdjustmentDetails" label="Dose adjustment details" rows={3} placeholder="List drugs and revised doses…" bind:value={m.doseAdjustmentDetails} />
		</Field>
	{/if}

	<Field label="Contrast-enhanced imaging planned?">
		<RadioGroup label="Contrast-enhanced imaging planned?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="contrast" value={opt.value} bind:group={m.contrastImagingPlanned} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Medication notes" inputId="medicationNotes">
		<TextAreaInput id="medicationNotes" label="Medication notes" rows={3} placeholder="Adherence concerns, side effects, deprescribing decisions…" bind:value={m.medicationNotes} />
	</Field>
</Fieldset>

<style>
	.subheading {
		margin: 1rem 0 0.25rem;
		font-size: 1rem;
		font-weight: 600;
	}
</style>
