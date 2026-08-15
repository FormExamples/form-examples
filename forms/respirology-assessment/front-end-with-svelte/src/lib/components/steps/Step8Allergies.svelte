<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import AllergyEntry from '#lib/components/ui/AllergyEntry.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const a = assessment.data.allergies;

	let envAllergenText = $state(a.environmentalAllergens.join(', '));

	$effect(() => {
		assessment.data.allergies.environmentalAllergens = envAllergenText
			.split(',')
			.map((s) => s.trim())
			.filter((s) => s.length > 0);
	});
</script>

<Fieldset legend="Allergies">
	<p class="hint">Drug allergies and environmental allergens.</p>

	<Field label="Drug Allergies">
		<AllergyEntry bind:allergies={a.drugAllergies} />
	</Field>

	<Field label="Environmental Allergens" inputId="envAllergens" description="comma-separated, e.g. dust mites, pollen, mould, animal dander">
		<TextAreaInput id="envAllergens" label="Environmental allergens" rows={3} bind:value={envAllergenText} />
	</Field>
</Fieldset>
