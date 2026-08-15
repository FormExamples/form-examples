<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const med = assessment.data.currentMedications;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Current Medications" description="Drugs that may interact with contraception.">
	<RadioGroup label="Enzyme-inducing drugs (e.g. carbamazepine, rifampicin)?" name="enzymeInducingDrugs" options={yesNo} bind:value={med.enzymeInducingDrugs} />
	{#if med.enzymeInducingDrugs === 'yes'}
		<TextInput label="Enzyme-inducing drug details" name="enzymeInducingDetails" bind:value={med.enzymeInducingDetails} />
	{/if}

	<RadioGroup label="Anticoagulants (blood thinners)?" name="anticoagulants" options={yesNo} bind:value={med.anticoagulants} />
	{#if med.anticoagulants === 'yes'}
		<TextInput label="Anticoagulant details" name="anticoagulantDetails" bind:value={med.anticoagulantDetails} />
	{/if}

	<RadioGroup label="Antiepileptic drugs?" name="antiepileptics" options={yesNo} bind:value={med.antiepileptics} />
	{#if med.antiepileptics === 'yes'}
		<TextInput label="Antiepileptic details" name="antiepilepticDetails" bind:value={med.antiepilepticDetails} />
	{/if}

	<RadioGroup label="Antiretroviral therapy (HIV)?" name="antiretrovirals" options={yesNo} bind:value={med.antiretrovirals} />
	{#if med.antiretrovirals === 'yes'}
		<TextInput label="Antiretroviral details" name="antiretroviralDetails" bind:value={med.antiretroviralDetails} />
	{/if}

	<RadioGroup label="Regular antibiotics?" name="antibiotics" options={yesNo} bind:value={med.antibiotics} />
	{#if med.antibiotics === 'yes'}
		<TextInput label="Antibiotic details" name="antibioticDetails" bind:value={med.antibioticDetails} />
	{/if}

	<RadioGroup label="SSRI/SNRI antidepressants?" name="ssriSnri" options={yesNo} bind:value={med.ssriSnri} />
	{#if med.ssriSnri === 'yes'}
		<TextInput label="SSRI/SNRI details" name="ssriSnriDetails" bind:value={med.ssriSnriDetails} />
	{/if}

	<RadioGroup label="Herbal remedies (e.g. St John's Wort)?" name="herbalRemedies" options={yesNo} bind:value={med.herbalRemedies} />
	{#if med.herbalRemedies === 'yes'}
		<TextInput label="Herbal remedy details" name="herbalDetails" bind:value={med.herbalDetails} />
	{/if}

	<TextAreaInput label="Other medications" name="otherMedications" rows={3} bind:value={med.otherMedications} />

	<RadioGroup label="Any drug allergies?" name="drugAllergies" options={yesNo} bind:value={med.drugAllergies} />
	{#if med.drugAllergies === 'yes'}
		<TextInput label="Drug allergy details" name="drugAllergyDetails" bind:value={med.drugAllergyDetails} />
	{/if}
</Fieldset>
