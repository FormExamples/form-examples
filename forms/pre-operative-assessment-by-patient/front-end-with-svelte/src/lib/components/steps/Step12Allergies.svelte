<script lang="ts">
	import AllergyEntry from '#lib/components/ui/AllergyEntry.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';

	import { assessment } from '#lib/stores/assessment.svelte.js';

</script>

<Fieldset legend="Allergies">
	<p class="hint">List any known allergies (medications, latex, foods, etc.)</p>
	<AllergyEntry bind:allergies={assessment.data.allergies} />
	{#if assessment.data.allergies.length === 0}
		<p class="mt-3 text-sm text-base-content/60">No allergies added. Click the button above to add one, or proceed to next step if you have none.</p>
	{/if}
</Fieldset>
