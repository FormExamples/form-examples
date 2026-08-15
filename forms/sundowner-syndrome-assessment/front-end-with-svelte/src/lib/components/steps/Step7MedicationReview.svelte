<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import MedicationEntry from '#lib/components/ui/MedicationEntry.svelte';

	const m = assessment.data.medicationReview;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];

	const burdenFlags: { key: 'anticholinergicBurden' | 'sedativeUse' | 'antipsychoticUse' | 'recentMedicationChange'; label: string }[] = [
		{ key: 'anticholinergicBurden', label: 'Anticholinergic burden?' },
		{ key: 'sedativeUse', label: 'Sedative / hypnotic use?' },
		{ key: 'antipsychoticUse', label: 'Antipsychotic use?' },
		{ key: 'recentMedicationChange', label: 'Recent medication change?' }
	];
</script>

<Fieldset legend="Medication Review">
	<p class="hint">Current medications and pharmacological risk factors for sundowning.</p>

	<Field label="Current medications" description="Add each regular medication, dose, frequency, and indication.">
		<MedicationEntry bind:medications={m.currentMedications} />
	</Field>

	<div class="field-grid">
		{#each burdenFlags as flag (flag.key)}
			<Field label={flag.label}>
				<RadioGroup label={flag.label}>
					{#each yesNo as opt (opt.value)}
						<label><input type="radio" class="radio-input" name={flag.key} value={opt.value} bind:group={m[flag.key]} /> {opt.label}</label>
					{/each}
				</RadioGroup>
			</Field>
		{/each}
	</div>

	{#if m.recentMedicationChange === 'yes'}
		<Field label="Recent medication change details" inputId="recentMedicationChangeDetails">
			<TextInput id="recentMedicationChangeDetails" label="Recent medication change details" bind:value={m.recentMedicationChangeDetails} />
		</Field>
	{/if}

	<Field label="Medication adherence" inputId="medicationAdherence">
		<Select id="medicationAdherence" label="Medication adherence" bind:value={m.medicationAdherence}>
			<option value="">-- Select --</option>
			<option value="good">Good</option>
			<option value="partial">Partial</option>
			<option value="poor">Poor</option>
		</Select>
	</Field>

	<Field label="Medication notes" inputId="medicationNotes">
		<TextAreaInput id="medicationNotes" label="Medication notes" rows={3} bind:value={m.medicationNotes} />
	</Field>
</Fieldset>

<style>
	.field-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.75rem 1.5rem;
	}
	@media (max-width: 640px) {
		.field-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
