<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import MedicationEntry from '#lib/components/ui/MedicationEntry.svelte';

	const meds = assessment.data.currentMedications;
</script>

<Fieldset legend="Current Medications">
	<p class="hint">List all medications you are currently taking.</p>

	<Field
		label="Psychiatric Medications"
		description="Antidepressants, anxiolytics, mood stabilisers, antipsychotics, etc."
	>
		<MedicationEntry bind:medications={meds.psychiatricMedications} />
	</Field>

	<Field
		label="Other Medications"
		description="All other medications including over-the-counter and supplements."
	>
		<MedicationEntry bind:medications={meds.otherMedications} />
	</Field>
</Fieldset>
