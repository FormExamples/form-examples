<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import TriStateField from '$lib/components/ui/TriStateField.svelte';

	const d = assessment.data.recordingReportingHandover;
</script>

<Fieldset legend="Recording, Reporting & Handover">
	<p class="hint">
		Documentation and handover competencies, plus debrief notes. These items are recorded for the
		training file but do not affect the pass / fail grade.
	</p>

	<TriStateField id="accidentBookEntry" label="Completes an accurate accident book entry." bind:value={d.accidentBookEntry} />
	<TriStateField id="riddorAwareness" label="Demonstrates awareness of RIDDOR reportable incidents." bind:value={d.riddorAwareness} />
	<TriStateField id="structuredHandoffSbar" label="Gives a structured SBAR handover to ambulance / clinical staff." bind:value={d.structuredHandoffSbar} />
	<TriStateField id="confidentialityMaintained" label="Maintains casualty confidentiality throughout." bind:value={d.confidentialityMaintained} />

	<Field label="Examiner notes" inputId="examinerNotes">
		<TextAreaInput id="examinerNotes" label="Examiner notes" rows={3} bind:value={d.examinerNotes} />
	</Field>
	<Field label="Trainee self-feedback" inputId="traineeFeedback">
		<TextAreaInput id="traineeFeedback" label="Trainee self-feedback" rows={3} bind:value={d.traineeFeedback} />
	</Field>
	<Field label="Structured debrief notes" inputId="debriefNotes">
		<TextAreaInput id="debriefNotes" label="Structured debrief notes" rows={3} bind:value={d.debriefNotes} />
	</Field>
</Fieldset>
