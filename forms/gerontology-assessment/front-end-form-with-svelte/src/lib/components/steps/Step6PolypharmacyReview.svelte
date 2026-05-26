<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import MedicationEntry from '$lib/components/ui/MedicationEntry.svelte';

	const p = assessment.data.polypharmacyReview;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Polypharmacy Review">
	<p class="hint">Medication count, high-risk medications, Beers criteria, and adherence.</p>

	<Field label="Total number of regular medications" inputId="numberOfMedications"><NumberInput id="numberOfMedications" label="Number of medications" min={0} max={50} bind:value={p.numberOfMedications} /></Field>

	<Field label="Are there any high-risk medications (e.g., anticoagulants, sedatives, opioids)?">
		<RadioGroup label="High-risk medications">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="highRiskMedications" value={opt.value} bind:group={p.highRiskMedications} /> {opt.label}</label>{/each}</RadioGroup>
	</Field>
	{#if p.highRiskMedications === 'yes'}
		<Field label="High-risk medication details" inputId="highRiskMedicationDetails"><TextAreaInput id="highRiskMedicationDetails" label="High-risk details" rows={3} placeholder="List the high-risk medications" bind:value={p.highRiskMedicationDetails} /></Field>
	{/if}

	<Field label="Any Beers criteria flags (potentially inappropriate medications for older adults)?">
		<RadioGroup label="Beers criteria flags">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="beersCriteriaFlags" value={opt.value} bind:group={p.beersCriteriaFlags} /> {opt.label}</label>{/each}</RadioGroup>
	</Field>
	{#if p.beersCriteriaFlags === 'yes'}
		<Field label="Beers criteria details" inputId="beersCriteriaDetails"><TextAreaInput id="beersCriteriaDetails" label="Beers details" rows={3} placeholder="List the flagged medications" bind:value={p.beersCriteriaDetails} /></Field>
	{/if}

	<Field label="Medication Adherence" inputId="medicationAdherence">
		<Select id="medicationAdherence" label="Medication Adherence" bind:value={p.medicationAdherence}>
			<option value="">-- Select --</option>
			<option value="good">Good</option>
			<option value="fair">Fair</option>
			<option value="poor">Poor</option>
		</Select>
	</Field>

	<Field label="Current Medications List">
		<MedicationEntry bind:medications={assessment.data.medications} />
	</Field>
</Fieldset>
