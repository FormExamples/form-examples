<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import MedicationEntry from '#lib/components/ui/MedicationEntry.svelte';

	const meds = assessment.data.currentMedications;
</script>

<Fieldset legend="Current Medications">
	<p class="hint">All current medications by category.</p>

	<Field label="Chemotherapy Agents"><MedicationEntry bind:medications={meds.chemotherapyAgents} /></Field>
	<Field label="Antiemetics"><MedicationEntry bind:medications={meds.antiemetics} /></Field>
	<Field label="Pain Medications"><MedicationEntry bind:medications={meds.painMedications} /></Field>
	<Field label="Growth Factors"><MedicationEntry bind:medications={meds.growthFactors} /></Field>
	<Field label="Supportive Care"><MedicationEntry bind:medications={meds.supportiveCare} /></Field>
</Fieldset>
