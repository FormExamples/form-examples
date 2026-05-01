<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import SectionCard from '$lib/components/ui/SectionCard.svelte';
	import Checkbox from '$lib/components/ui/Checkbox.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import TextArea from '$lib/components/ui/TextArea.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import SelectInput from '$lib/components/ui/SelectInput.svelte';

	const m = assessment.data.pastMedicalHistory;

	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];

	const vaxOptions = [
		{ value: 'unknown', label: 'Unknown' },
		{ value: 'no', label: 'No' },
		{ value: 'yes', label: 'Yes' }
	];
</script>

<SectionCard
	title="Past Medical History"
	description="Medications, allergies, pregnancy, vaccinations, substance use, surgical and family history."
>
	<TextInput
		label="History obtained from"
		name="historyObtainedFrom"
		bind:value={m.historyObtainedFrom}
		placeholder="Patient / family / EMS / chart"
		required
	/>

	<TextArea label="Medications" name="medications" bind:value={m.medications} rows={3} />
	<Checkbox label="Medications: Unknown" name="medicationsUnknown" bind:checked={m.medicationsUnknown} />

	<TextArea label="Allergies" name="allergies" bind:value={m.allergies} rows={2} />
	<Checkbox label="Allergies: Unknown" name="allergiesUnknown" bind:checked={m.allergiesUnknown} />

	<h3 class="mt-4 mb-2 text-base font-semibold text-gray-800">Reproductive history</h3>
	<TextInput label="Last menstrual cycle" name="lastMenstrualCycle" type="date" bind:value={m.lastMenstrualCycle} />
	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<NumberInput label="Gravida (G)" name="gravida" bind:value={m.gravida} min={0} />
		<NumberInput label="Para (P)" name="para" bind:value={m.para} min={0} />
	</div>
	<Checkbox label="LMP / G&P: Unknown" name="lmpUnknown" bind:checked={m.lmpUnknown} />

	<RadioGroup label="Pregnant?" name="pregnant" options={yesNo} bind:value={m.pregnant} />
	{#if m.pregnant === 'yes'}
		<Checkbox label="Pregnancy: Reported" name="pregnancyReported" bind:checked={m.pregnancyReported} />
		<Checkbox label="Pregnancy: Testing done" name="pregnancyTestingDone" bind:checked={m.pregnancyTestingDone} />
	{/if}

	<h3 class="mt-4 mb-2 text-base font-semibold text-gray-800">Vaccinations</h3>
	<SelectInput label="Vaccinations up to date?" name="vaccinationsStatus" options={vaxOptions} bind:value={m.vaccinationsStatus} />
	{#if m.vaccinationsStatus === 'yes'}
		<TextInput label="Last vaccination date" name="vaccinationsDate" type="date" bind:value={m.vaccinationsDate} />
	{/if}

	<h3 class="mt-4 mb-2 text-base font-semibold text-gray-800">Substance use</h3>
	<Checkbox label="Tobacco" name="tobaccoUse" bind:checked={m.tobaccoUse} />
	<Checkbox label="Alcohol" name="alcoholUse" bind:checked={m.alcoholUse} />
	<Checkbox label="Drugs" name="drugUse" bind:checked={m.drugUse} />
	<Checkbox label="IV drug use" name="ivDrugUse" bind:checked={m.ivDrugUse} />
	<Checkbox label="Substance use: Unknown" name="substanceUseUnknown" bind:checked={m.substanceUseUnknown} />

	<h3 class="mt-4 mb-2 text-base font-semibold text-gray-800">Past medical conditions</h3>
	<Checkbox label="HTN (hypertension)" name="pmhHtn" bind:checked={m.pmhHtn} />
	<Checkbox label="DM (diabetes mellitus)" name="pmhDm" bind:checked={m.pmhDm} />
	<Checkbox label="COPD" name="pmhCopd" bind:checked={m.pmhCopd} />
	<Checkbox label="Psychiatric" name="pmhPsych" bind:checked={m.pmhPsych} />
	<Checkbox label="Renal disease" name="pmhRenalDisease" bind:checked={m.pmhRenalDisease} />
	<Checkbox label="Past medical history: Unknown" name="pmhUnknown" bind:checked={m.pmhUnknown} />
	<TextArea label="Other past medical conditions" name="pmhOther" bind:value={m.pmhOther} rows={2} />

	<TextArea label="Family history" name="familyHistory" bind:value={m.familyHistory} rows={2} />
	<Checkbox label="Family history: Unknown" name="familyHistoryUnknown" bind:checked={m.familyHistoryUnknown} />

	<TextArea
		label="Past surgeries (type & date)"
		name="pastSurgeries"
		bind:value={m.pastSurgeries}
		rows={2}
	/>
	<Checkbox label="Past surgeries: Unknown" name="pastSurgeriesUnknown" bind:checked={m.pastSurgeriesUnknown} />

	<TextArea label="Safe at home?" name="safeAtHome" bind:value={m.safeAtHome} rows={2} />
</SectionCard>
