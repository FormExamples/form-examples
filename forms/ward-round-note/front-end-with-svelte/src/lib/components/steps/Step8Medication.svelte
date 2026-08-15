<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const m = assessment.data.medication;
</script>

<Fieldset legend="Step 8 of 11 — Medication changes">
	<p class="hint">
		Medication changes made on the review. Required component — record changes or select "no
		changes".
	</p>

	<Field label="Medication changes" inputId="medication-medicationChanges">
		<TextAreaInput
			id="medication-medicationChanges"
			label="Medication changes"
			rows={3}
			placeholder="e.g. Switched IV to oral antibiotics. Stopped regular NSAID given AKI."
			bind:value={m.medicationChanges}
		/>
	</Field>

	<Field
		label="No medication changes?"
		description="Yes documents the medication component as a deliberate negative."
		inputId="medication-noMedicationChanges"
	>
		<Select id="medication-noMedicationChanges" label="No medication changes?" bind:value={m.noMedicationChanges}>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>
</Fieldset>
