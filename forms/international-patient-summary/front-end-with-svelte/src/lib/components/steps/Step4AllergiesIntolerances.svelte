<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import AllergyEntry from '#lib/components/ui/AllergyEntry.svelte';

	const d = assessment.data;
</script>

<Fieldset legend="Allergies & Intolerances">
	<p class="hint">Drug, food, and environmental allergies. Add a "no known allergies" entry if applicable.</p>
	<AllergyEntry bind:allergies={d.allergiesIntolerances} />
</Fieldset>
