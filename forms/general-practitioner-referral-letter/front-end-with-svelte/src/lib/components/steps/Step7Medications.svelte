<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const m = assessment.data.medications;
</script>

<Fieldset legend="Step 7 of 9 — Medications and allergies">
	<p class="hint">The patient’s current medications and known allergies.</p>

	<Field label="Current medications" inputId="medications-currentMedications">
		<TextAreaInput
			id="medications-currentMedications"
			label="Current medications"
			rows={3}
			placeholder="Current repeat and acute medications with doses."
			bind:value={m.currentMedications}
		/>
	</Field>

	<Field label="Allergies and reactions" inputId="medications-allergies">
		<TextAreaInput
			id="medications-allergies"
			label="Allergies and reactions"
			rows={2}
			placeholder="Known drug allergies and the reactions they cause."
			bind:value={m.allergies}
		/>
	</Field>
</Fieldset>
