<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import TriStateField from '#lib/components/ui/TriStateField.svelte';

	const o = assessment.data.overallResultSignoff;
</script>

<Fieldset legend="Overall Result, Feedback & Signoff">
	<p class="hint">The examiner's recommended outcome and debrief. The engine computes the final grade on submit.</p>

	<Field label="Examiner's recommended outcome" inputId="examinerOutcome">
		<Select id="examinerOutcome" label="Examiner's recommended outcome" bind:value={o.examinerOutcome}>
			<option value="">-- Select --</option>
			<option value="pass">Pass</option>
			<option value="needs-development">Needs Development</option>
			<option value="fail">Fail</option>
		</Select>
	</Field>

	<Field label="Strengths" inputId="strengths">
		<TextAreaInput id="strengths" label="Strengths" rows={3} bind:value={o.strengths} />
	</Field>

	<Field label="Development areas" inputId="developmentAreas">
		<TextAreaInput id="developmentAreas" label="Development areas" rows={3} bind:value={o.developmentAreas} />
	</Field>

	<Field label="Examiner notes" inputId="examinerNotes">
		<TextAreaInput id="examinerNotes" label="Examiner notes" rows={3} bind:value={o.examinerNotes} />
	</Field>

	<Field label="Candidate feedback" inputId="candidateFeedback">
		<TextAreaInput id="candidateFeedback" label="Candidate feedback" rows={3} bind:value={o.candidateFeedback} />
	</Field>

	<TriStateField label="Candidate acknowledged the result and feedback" name="candidateAcknowledged" bind:value={o.candidateAcknowledged} />
</Fieldset>
