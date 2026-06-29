<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const c = assessment.data.candidateExaminerScenario;
</script>

<Fieldset legend="Candidate, Examiner & Scenario">
	<p class="hint">Identifying details for the candidate, examiner, and the assessment scenario.</p>

	<div class="field-grid">
		<Field label="Candidate first name" inputId="candidateFirstName">
			<TextInput id="candidateFirstName" label="Candidate first name" bind:value={c.candidateFirstName} />
		</Field>
		<Field label="Candidate last name" required inputId="candidateLastName">
			<TextInput id="candidateLastName" label="Candidate last name" required bind:value={c.candidateLastName} />
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Candidate ID" inputId="candidateId">
			<TextInput id="candidateId" label="Candidate ID" placeholder="e.g. EMT-2026-0042" bind:value={c.candidateId} />
		</Field>
		<Field label="Attempt" inputId="attempt">
			<Select id="attempt" label="Attempt" bind:value={c.attempt}>
				<option value="">-- Select --</option>
				<option value="first-attempt">First attempt</option>
				<option value="retest">Retest</option>
			</Select>
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Examiner name" inputId="examinerName">
			<TextInput id="examinerName" label="Examiner name" bind:value={c.examinerName} />
		</Field>
		<Field label="Session date" required inputId="sessionDate">
			<DateInput id="sessionDate" label="Session date" required bind:value={c.sessionDate} />
		</Field>
	</div>

	<Field label="Station / location" inputId="stationLocation">
		<TextInput id="stationLocation" label="Station / location" placeholder="e.g. Pittsburgh Paramedic Institute" bind:value={c.stationLocation} />
	</Field>

	<Field label="Chief complaint given in scenario brief" inputId="chiefComplaintGiven">
		<TextInput id="chiefComplaintGiven" label="Chief complaint given in scenario brief" placeholder="e.g. Chest pain" bind:value={c.chiefComplaintGiven} />
	</Field>

	<Field label="Scenario summary" inputId="scenarioSummary">
		<TextAreaInput id="scenarioSummary" label="Scenario summary" rows={3} bind:value={c.scenarioSummary} />
	</Field>
</Fieldset>

<style>
	.field-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}
	@media (max-width: 640px) {
		.field-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
