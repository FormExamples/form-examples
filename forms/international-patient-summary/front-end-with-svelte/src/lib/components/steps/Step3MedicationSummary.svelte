<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import MedicationEntry from '#lib/components/ui/MedicationEntry.svelte';

	const d = assessment.data;
</script>

<Fieldset legend="Medication Summary">
	<p class="hint">Current and recent medications. Use ATC coding where possible.</p>
	<MedicationEntry bind:medications={d.medicationSummary} />
</Fieldset>
