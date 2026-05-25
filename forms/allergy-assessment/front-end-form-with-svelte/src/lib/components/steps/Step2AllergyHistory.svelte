<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const h = assessment.data.allergyHistory;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Allergy History">
	<p class="hint">Age of onset, known allergens, and family history.</p>

	<Field label="Age of allergy onset (years)" inputId="ageOfOnset">
		<NumberInput id="ageOfOnset" label="Age of allergy onset" min={0} max={120} bind:value={h.ageOfOnset} />
	</Field>

	<Field label="Known allergens (list all)" inputId="knownAllergens">
		<TextAreaInput id="knownAllergens" label="Known allergens" rows={3} bind:value={h.knownAllergens} />
	</Field>

	<Field label="Family history of atopy (asthma, eczema, hay fever)?">
		<RadioGroup label="Family history of atopy">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="familyAtopy" value={opt.value} bind:group={h.familyHistoryOfAtopy} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if h.familyHistoryOfAtopy === 'yes'}
		<Field label="Atopy details" inputId="familyAtopyDetails">
			<TextAreaInput id="familyAtopyDetails" label="Atopy details" rows={2} bind:value={h.familyAtopyDetails} />
		</Field>
	{/if}

	<Field label="Family history of allergy?">
		<RadioGroup label="Family history of allergy">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="familyAllergy" value={opt.value} bind:group={h.familyHistoryOfAllergy} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if h.familyHistoryOfAllergy === 'yes'}
		<Field label="Allergy details" inputId="familyAllergyDetails">
			<TextAreaInput id="familyAllergyDetails" label="Allergy details" rows={2} bind:value={h.familyAllergyDetails} />
		</Field>
	{/if}
</Fieldset>
