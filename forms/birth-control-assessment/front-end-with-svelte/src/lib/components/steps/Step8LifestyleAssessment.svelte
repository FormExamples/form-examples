<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';

	const l = assessment.data.lifestyleAssessment;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
	const smoking = [
		{ value: 'current', label: 'Current smoker' },
		{ value: 'ex-smoker', label: 'Ex-smoker' },
		{ value: 'never', label: 'Never smoked' }
	];
	const alcohol = [
		{ value: 'none', label: 'None' },
		{ value: 'within-guidelines', label: 'Within guidelines' },
		{ value: 'above-guidelines', label: 'Above guidelines' }
	];
	const exercise = [
		{ value: 'none', label: 'None' },
		{ value: 'occasional', label: 'Occasional' },
		{ value: 'regular', label: 'Regular' },
		{ value: 'daily', label: 'Daily' }
	];
	const partners = [
		{ value: 'one', label: 'One' },
		{ value: 'multiple', label: 'Multiple' }
	];
</script>

<Fieldset legend="Lifestyle Assessment" description="Smoking, alcohol, exercise, and sexual health.">
	<RadioGroup label="Smoking status" name="smoking" options={smoking} bind:value={l.smoking} />
	{#if l.smoking === 'current'}
		<NumberInput label="Cigarettes per day" name="cigarettesPerDay" min={1} max={80} bind:value={l.cigarettesPerDay} />
		<RadioGroup label="Are you aged 35 or over?" name="ageOver35Smoker" options={yesNo} bind:value={l.ageOver35Smoker} />
	{/if}

	<RadioGroup label="Alcohol consumption" name="alcohol" options={alcohol} bind:value={l.alcohol} />
	{#if l.alcohol === 'within-guidelines' || l.alcohol === 'above-guidelines'}
		<NumberInput label="Units per week" name="alcoholUnitsPerWeek" min={0} max={100} bind:value={l.alcoholUnitsPerWeek} />
	{/if}

	<RadioGroup label="Recreational drug use?" name="recreationalDrugUse" options={yesNo} bind:value={l.recreationalDrugUse} />
	{#if l.recreationalDrugUse === 'yes'}
		<TextInput label="Recreational drug details" name="recreationalDrugDetails" bind:value={l.recreationalDrugDetails} />
	{/if}

	<RadioGroup label="Exercise frequency" name="exerciseFrequency" options={exercise} bind:value={l.exerciseFrequency} />

	<RadioGroup label="Currently sexually active?" name="sexualActivity" options={yesNo} bind:value={l.sexualActivity} />
	{#if l.sexualActivity === 'yes'}
		<RadioGroup label="Number of partners" name="numberOfPartners" options={partners} bind:value={l.numberOfPartners} />
	{/if}
</Fieldset>
