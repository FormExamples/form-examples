<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const d = assessment.data.patientOutcome;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset title="Patient Outcome" description="Harm and consequences for the patient">
	<RadioGroup label="Did harm reach the patient?" name="harmReachedPatient" options={yesNo} bind:value={d.harmReachedPatient} />

	<Select
		label="Harm Level"
		name="harmLevel"
		options={[
			{ value: 'none', label: 'None' },
			{ value: 'low', label: 'Low' },
			{ value: 'moderate', label: 'Moderate' },
			{ value: 'severe', label: 'Severe' },
			{ value: 'death', label: 'Death' }
		]}
		bind:value={d.harmLevel}
	/>
	{#if d.harmReachedPatient === 'yes'}
		<TextAreaInput label="Harm Description" name="harmDescription" rows={3} bind:value={d.harmDescription} />
	{/if}

	<RadioGroup label="Additional treatment required?" name="additionalTreatmentRequired" options={yesNo} bind:value={d.additionalTreatmentRequired} />
	{#if d.additionalTreatmentRequired === 'yes'}
		<TextInput label="Additional Treatment Details" name="additionalTreatmentDetails" bind:value={d.additionalTreatmentDetails} />
	{/if}

	<RadioGroup label="Extended hospital stay?" name="extendedHospitalStay" options={yesNo} bind:value={d.extendedHospitalStay} />
	{#if d.extendedHospitalStay === 'yes'}
		<NumberInput label="Extra Days" name="extraDays" min={0} bind:value={d.extraDays} />
	{/if}

	<RadioGroup label="Readmission required?" name="readmissionRequired" options={yesNo} bind:value={d.readmissionRequired} />

	<RadioGroup label="Permanent disability?" name="permanentDisability" options={yesNo} bind:value={d.permanentDisability} />
	{#if d.permanentDisability === 'yes'}
		<TextInput label="Disability Details" name="disabilityDetails" bind:value={d.disabilityDetails} />
	{/if}

	<RadioGroup label="Did the patient die?" name="patientDied" options={yesNo} bind:value={d.patientDied} />
	{#if d.patientDied === 'yes'}
		<TextInput label="Date of Death" name="deathDate" type="date" bind:value={d.deathDate} />
	{/if}

	<TextAreaInput label="Outcome Notes" name="outcomeNotes" rows={3} bind:value={d.outcomeNotes} />
</Fieldset>
