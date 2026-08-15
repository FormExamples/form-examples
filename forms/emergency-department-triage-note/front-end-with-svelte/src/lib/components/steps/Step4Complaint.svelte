<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const c = assessment.data.complaint;
</script>

<Fieldset legend="Step 4 of 8 — Presenting complaint">
	<p class="hint">The chief complaint, relevant brief history, and onset timing.</p>

	<Field label="Presenting complaint" required inputId="complaint-presentingComplaint">
		<TextAreaInput
			id="complaint-presentingComplaint"
			label="Presenting complaint"
			rows={3}
			required
			placeholder="Chief complaint in the patient's or clinician's words."
			bind:value={c.presentingComplaint}
		/>
	</Field>

	<Field label="Brief relevant history" inputId="complaint-briefHistory">
		<TextAreaInput
			id="complaint-briefHistory"
			label="Brief relevant history"
			rows={3}
			placeholder="Relevant background, medications, allergies, comorbidities."
			bind:value={c.briefHistory}
		/>
	</Field>

	<Field label="Symptom onset" inputId="complaint-symptomOnset">
		<TextInput
			id="complaint-symptomOnset"
			label="Symptom onset"
			placeholder="e.g. 2 hours ago, on waking, gradual over 3 days"
			bind:value={c.symptomOnset}
		/>
	</Field>
</Fieldset>
