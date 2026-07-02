<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const c = assessment.data.clinical;
</script>

<Fieldset legend="Step 5 of 9 — Reason and history">
	<p class="hint">Why the patient is being referred, and the clinical background.</p>

	<Field label="Reason for referral" required inputId="clinical-reasonForReferral">
		<TextAreaInput
			id="clinical-reasonForReferral"
			label="Reason for referral"
			rows={3}
			required
			placeholder="e.g. Change in bowel habit and weight loss over 3 months."
			bind:value={c.reasonForReferral}
		/>
	</Field>

	<Field label="Relevant clinical history" required inputId="clinical-relevantHistory">
		<TextAreaInput
			id="clinical-relevantHistory"
			label="Relevant clinical history"
			rows={3}
			required
			placeholder="Relevant past medical, surgical, and family history."
			bind:value={c.relevantHistory}
		/>
	</Field>

	<Field label="Presenting problem" inputId="clinical-presentingProblem">
		<TextAreaInput
			id="clinical-presentingProblem"
			label="Presenting problem"
			rows={2}
			placeholder="The presenting complaint in the patient’s own terms where useful."
			bind:value={c.presentingProblem}
		/>
	</Field>

	<Field label="Symptom duration" inputId="clinical-symptomDuration">
		<TextInput
			id="clinical-symptomDuration"
			label="Symptom duration"
			placeholder="e.g. 3 months"
			bind:value={c.symptomDuration}
		/>
	</Field>

	<Field
		label="Red-flag symptoms"
		description="Documented red-flag symptoms; these raise the emergency-features flag."
		inputId="clinical-redFlagSymptoms"
	>
		<TextAreaInput
			id="clinical-redFlagSymptoms"
			label="Red-flag symptoms"
			rows={2}
			placeholder="e.g. Rectal bleeding; unintentional weight loss."
			bind:value={c.redFlagSymptoms}
		/>
	</Field>
</Fieldset>
