<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';

	import { assessment } from '$lib/stores/assessment.svelte';

	const f = assessment.data.familyHistory;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Family History">
	<p class="hint">Medical conditions in your immediate family (parents, siblings, children)</p>
	<Field label="Heart disease in family?"><RadioGroup label="Heart disease in family?">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="fhHeart" value={opt.value} bind:group={f.heartDisease}/> {opt.label}</label>{/each}</RadioGroup></Field>
	{#if f.heartDisease === 'yes'}
		<Field label="Please provide details" inputId="fhHeartDetails"><TextInput id="fhHeartDetails" label="Please provide details" bind:value={f.heartDiseaseDetails} /></Field>
	{/if}

	<Field label="Cancer in family?"><RadioGroup label="Cancer in family?">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="fhCancer" value={opt.value} bind:group={f.cancer}/> {opt.label}</label>{/each}</RadioGroup></Field>
	{#if f.cancer === 'yes'}
		<Field label="Please provide details (type, relation)" inputId="fhCancerDetails"><TextInput id="fhCancerDetails" label="Please provide details (type, relation)" bind:value={f.cancerDetails} /></Field>
	{/if}

	<Field label="Diabetes in family?"><RadioGroup label="Diabetes in family?">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="fhDiabetes" value={opt.value} bind:group={f.diabetes}/> {opt.label}</label>{/each}</RadioGroup></Field>
	{#if f.diabetes === 'yes'}
		<Field label="Please provide details" inputId="fhDiabetesDetails"><TextInput id="fhDiabetesDetails" label="Please provide details" bind:value={f.diabetesDetails} /></Field>
	{/if}

	<Field label="Stroke in family?"><RadioGroup label="Stroke in family?">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="fhStroke" value={opt.value} bind:group={f.stroke}/> {opt.label}</label>{/each}</RadioGroup></Field>
	{#if f.stroke === 'yes'}
		<Field label="Please provide details" inputId="fhStrokeDetails"><TextInput id="fhStrokeDetails" label="Please provide details" bind:value={f.strokeDetails} /></Field>
	{/if}

	<Field label="Mental illness in family?"><RadioGroup label="Mental illness in family?">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="fhMental" value={opt.value} bind:group={f.mentalIllness}/> {opt.label}</label>{/each}</RadioGroup></Field>
	{#if f.mentalIllness === 'yes'}
		<Field label="Please provide details" inputId="fhMentalDetails"><TextInput id="fhMentalDetails" label="Please provide details" bind:value={f.mentalIllnessDetails} /></Field>
	{/if}

	<Field label="Genetic conditions in family?"><RadioGroup label="Genetic conditions in family?">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="fhGenetic" value={opt.value} bind:group={f.geneticConditions}/> {opt.label}</label>{/each}</RadioGroup></Field>
	{#if f.geneticConditions === 'yes'}
		<Field label="Please provide details" inputId="fhGeneticDetails"><TextInput id="fhGeneticDetails" label="Please provide details" bind:value={f.geneticConditionsDetails} /></Field>
	{/if}
</Fieldset>
