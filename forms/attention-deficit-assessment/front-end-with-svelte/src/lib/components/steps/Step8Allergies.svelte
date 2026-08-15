<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import AllergyEntry from '#lib/components/ui/AllergyEntry.svelte';
</script>

<Fieldset legend="Allergies">
	<p class="hint">List any known drug allergies.</p>
	<Field label="Allergies">
		<AllergyEntry bind:allergies={assessment.data.allergies} />
	</Field>
</Fieldset>
