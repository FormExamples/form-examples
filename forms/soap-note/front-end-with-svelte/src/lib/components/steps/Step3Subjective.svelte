<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const s = assessment.data.subjective;
</script>

<Fieldset legend="Step 3 of 7 — Subjective (S)">
	<p class="hint">
		History and patient-reported information. Presenting complaint and its history are required
		components.
	</p>

	<Field label="Presenting complaint" inputId="subjective-presentingComplaint">
		<TextAreaInput
			id="subjective-presentingComplaint"
			label="Presenting complaint"
			rows={2}
			placeholder="e.g. Central chest pain for 2 hours"
			bind:value={s.presentingComplaint}
		/>
	</Field>

	<Field
		label="History of presenting complaint"
		inputId="subjective-historyOfPresentingComplaint"
	>
		<TextAreaInput
			id="subjective-historyOfPresentingComplaint"
			label="History of presenting complaint"
			rows={3}
			placeholder="Onset, character, radiation, associated symptoms, timing, exacerbating and relieving factors."
			bind:value={s.historyOfPresentingComplaint}
		/>
	</Field>

	<Field label="Patient-reported symptoms" inputId="subjective-patientReportedSymptoms">
		<TextAreaInput
			id="subjective-patientReportedSymptoms"
			label="Patient-reported symptoms"
			rows={2}
			placeholder="Other symptoms reported by the patient."
			bind:value={s.patientReportedSymptoms}
		/>
	</Field>

	<Field
		label="Relevant past history, medication, and allergies"
		inputId="subjective-relevantHistory"
	>
		<TextAreaInput
			id="subjective-relevantHistory"
			label="Relevant past history, medication, and allergies"
			rows={2}
			placeholder="Relevant past medical history, current medication, and allergies."
			bind:value={s.relevantHistory}
		/>
	</Field>

	<Field
		label="Red-flag symptoms present?"
		description="Yes makes safety-netting a required component and raises a flag if the Plan is empty."
		inputId="subjective-redFlagSymptoms"
	>
		<Select
			id="subjective-redFlagSymptoms"
			label="Red-flag symptoms present?"
			bind:value={s.redFlagSymptoms}
		>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>
</Fieldset>
