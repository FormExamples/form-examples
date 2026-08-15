<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import AllergyEntry from '#lib/components/ui/AllergyEntry.svelte';
	import StringListEntry from '#lib/components/ui/StringListEntry.svelte';

	const f = assessment.data.foodAllergiesIntolerances;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Food Allergies & Intolerances">
	<p class="hint">Document food allergies (with reactions and severity) and intolerances.</p>

	<Field label="Food allergies">
		<AllergyEntry bind:allergies={f.foodAllergies} />
	</Field>

	<Field label="Food intolerances">
		<StringListEntry bind:items={f.foodIntolerances} placeholder="e.g. onions, spicy foods, FODMAPs" addLabel="Add food intolerance" />
	</Field>

	<Field label="Do you have lactose intolerance?">
		<RadioGroup label="Lactose intolerance">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="lactoseIntolerance" value={opt.value} bind:group={f.lactoseIntolerance} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	<Field label="Do you have gluten intolerance / coeliac disease?">
		<RadioGroup label="Gluten intolerance">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="glutenIntolerance" value={opt.value} bind:group={f.glutenIntolerance} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Has formal food-allergy testing been done?">
		<RadioGroup label="Allergy testing done">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="allergyTestingDone" value={opt.value} bind:group={f.allergyTestingDone} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if f.allergyTestingDone === 'yes'}
		<Field label="Allergy test results" inputId="allergyTestResults">
			<TextAreaInput id="allergyTestResults" label="Allergy test results" rows={3} bind:value={f.allergyTestResults} />
		</Field>
	{/if}
</Fieldset>
