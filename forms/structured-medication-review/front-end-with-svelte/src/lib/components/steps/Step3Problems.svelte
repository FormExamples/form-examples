<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const p = assessment.data.problems;
</script>

<Fieldset legend="Step 3 of 8 — Problems and patient concerns">
	<p class="hint">
		Presenting problems, patient-reported issues, and what matters most to the patient.
	</p>

	<Field
		label="Presenting problems / reasons for review"
		required
		description="Required for a complete review."
		inputId="problems-presentingProblems"
	>
		<TextAreaInput
			id="problems-presentingProblems"
			label="Presenting problems"
			rows={3}
			placeholder="e.g. Problematic polypharmacy, recent fall, dizziness"
			bind:value={p.presentingProblems}
		/>
	</Field>

	<Field
		label="Patient-reported side effects and difficulties"
		inputId="problems-patientReportedIssues"
	>
		<TextAreaInput
			id="problems-patientReportedIssues"
			label="Patient-reported side effects and difficulties"
			rows={3}
			placeholder="e.g. Dry mouth, drowsiness, trouble opening blister packs"
			bind:value={p.patientReportedIssues}
		/>
	</Field>

	<Field
		label="What matters to the patient"
		required
		description="Required for a complete review."
		inputId="problems-whatMattersToPatient"
	>
		<TextAreaInput
			id="problems-whatMattersToPatient"
			label="What matters to the patient"
			rows={3}
			placeholder="e.g. Wants to reduce the number of tablets and stay independent"
			bind:value={p.whatMattersToPatient}
		/>
	</Field>
</Fieldset>
