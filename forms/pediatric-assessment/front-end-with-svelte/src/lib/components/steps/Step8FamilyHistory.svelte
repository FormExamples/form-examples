<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const fh = assessment.data.familyHistory;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Family History">
	<p class="hint">Hereditary and genetic factors.</p>

	<Field label="Are there any known genetic conditions in the family?">
		<RadioGroup label="Genetic conditions">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="genetic" value={opt.value} bind:group={fh.geneticConditions} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if fh.geneticConditions === 'yes'}
		<Field label="Please describe genetic conditions" inputId="geneticDetails">
			<TextAreaInput id="geneticDetails" label="Genetic condition details" rows={3} bind:value={fh.geneticConditionDetails} />
		</Field>
	{/if}

	<Field label="Are there any chronic diseases in the family?">
		<RadioGroup label="Chronic family diseases">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="chronicFamily" value={opt.value} bind:group={fh.chronicDiseases} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if fh.chronicDiseases === 'yes'}
		<Field label="Please describe chronic diseases" inputId="chronicFamilyDetails">
			<TextAreaInput id="chronicFamilyDetails" label="Chronic disease details" rows={3} bind:value={fh.chronicDiseaseDetails} />
		</Field>
	{/if}

	<Field label="Are there any developmental disorders in the family?">
		<RadioGroup label="Developmental disorders">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="devDisorders" value={opt.value} bind:group={fh.developmentalDisorders} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if fh.developmentalDisorders === 'yes'}
		<Field label="Please describe developmental disorders" inputId="devDisorderDetails">
			<TextAreaInput id="devDisorderDetails" label="Developmental disorder details" rows={3} bind:value={fh.developmentalDisorderDetails} />
		</Field>
	{/if}

	<Field label="Is there consanguinity (parents are related)?">
		<RadioGroup label="Consanguinity">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="consanguinity" value={opt.value} bind:group={fh.consanguinity} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
</Fieldset>
