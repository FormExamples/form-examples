<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import AllergyEntry from '#lib/components/ui/AllergyEntry.svelte';

	const a = assessment.data.allergiesDiet;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Allergies & Diet">
	<p class="hint">Drug allergies, food intolerances, and dietary restrictions.</p>

	<Field label="Drug Allergies">
		<AllergyEntry bind:allergies={a.drugAllergies} />
		{#if a.drugAllergies.length === 0}
			<p class="hint">No drug allergies added. Click the button above to add one, or proceed if you have none.</p>
		{/if}
	</Field>

	<Field label="Do you have any food intolerances?" inputId="foodIntolerances">
		<TextAreaInput id="foodIntolerances" label="Food intolerances" rows={3} placeholder="e.g. spicy food, dairy, wheat" bind:value={a.foodIntolerances} />
	</Field>

	<Field label="Do you have any dietary restrictions?" inputId="dietaryRestrictions">
		<TextAreaInput id="dietaryRestrictions" label="Dietary restrictions" rows={3} placeholder="e.g. vegetarian, vegan, halal, kosher" bind:value={a.dietaryRestrictions} />
	</Field>

	<Field label="Do you have a gluten intolerance?">
		<RadioGroup label="Gluten intolerance">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="glutenIntolerance" value={opt.value} bind:group={a.glutenIntolerance} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Do you have a lactose intolerance?">
		<RadioGroup label="Lactose intolerance">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="lactoseIntolerance" value={opt.value} bind:group={a.lactoseIntolerance} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
</Fieldset>
