<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import { resultStore } from '$lib/stores/result.svelte';

	const d = resultStore.data;
</script>

<Fieldset legend="4. Allergens & Reactions">
	<p class="hint">
		The allergens tested and their measured reactions (weal sizes in mm and specific-IgE in kUA/L).
	</p>

	<Field label="Allergens tested" inputId="allergensTested">
		<TextAreaInput
			id="allergensTested"
			label="Allergens tested"
			rows={3}
			placeholder="e.g. house dust mite, cat, peanut, egg, milk, amoxicillin…"
			bind:value={d.allergensTested}
		/>
	</Field>

	<Field
		label="Weal sizes"
		inputId="whealSizes"
		description="Measured weal sizes per allergen in millimetres, with positive (histamine) and negative (saline) controls."
	>
		<TextAreaInput
			id="whealSizes"
			label="Weal sizes"
			rows={3}
			placeholder="e.g. peanut 8 mm; cat 0 mm; histamine 6 mm; saline 0 mm…"
			bind:value={d.whealSizes}
		/>
	</Field>

	<Field
		label="Specific-IgE results"
		inputId="specificIgeResults"
		description="Specific-IgE blood (sIgE) results per allergen in kUA/L, where performed."
	>
		<TextAreaInput
			id="specificIgeResults"
			label="Specific-IgE results"
			rows={3}
			placeholder="e.g. peanut sIgE 14 kUA/L; Ara h 2 9 kUA/L…"
			bind:value={d.specificIgeResults}
		/>
	</Field>

	<Field label="Sensitised allergens" inputId="sensitisedAllergens">
		<TextAreaInput
			id="sensitisedAllergens"
			label="Sensitised allergens"
			rows={2}
			placeholder="Allergens to which sensitisation was demonstrated…"
			bind:value={d.sensitisedAllergens}
		/>
	</Field>
</Fieldset>
