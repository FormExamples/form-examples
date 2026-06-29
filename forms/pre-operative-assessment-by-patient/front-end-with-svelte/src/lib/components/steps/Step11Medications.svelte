<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import MedicationEntry from '$lib/components/ui/MedicationEntry.svelte';

	import { assessment } from '$lib/stores/assessment.svelte';

</script>

<Fieldset legend="Medications">
	<p class="hint">List all medications you currently take, including over-the-counter</p>
	<MedicationEntry bind:medications={assessment.data.medications} />
	{#if assessment.data.medications.length === 0}
		<p class="mt-3 text-sm text-base-content/60">No medications added. Click the button above to add one, or proceed to next step if you take none.</p>
	{/if}
</Fieldset>
