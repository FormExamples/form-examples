<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const d = assessment.data.rolePlay1;
</script>

<Fieldset legend="Role-play 1 — Patient interview">
	<p class="hint">
		The candidate takes the patient's history. Record the scenario context and the assessor's
		observations.
	</p>

	<Field label="Clinical setting" inputId="rp1Setting" description="e.g. General practice surgery, hospital ward">
		<TextInput id="rp1Setting" label="Clinical setting" bind:value={d.setting} />
	</Field>

	<Field label="Patient role" inputId="rp1PatientRole" description="The role played by the interlocutor">
		<TextInput id="rp1PatientRole" label="Patient role" bind:value={d.patientRole} />
	</Field>

	<Field label="Candidate task" inputId="rp1CandidateTask">
		<TextAreaInput id="rp1CandidateTask" label="Candidate task" rows={2} bind:value={d.candidateTask} />
	</Field>

	<Field label="Assessor notes" inputId="rp1Notes">
		<TextAreaInput id="rp1Notes" label="Assessor notes" rows={3} bind:value={d.notes} />
	</Field>

	<Field label="Role-play completed">
		<RadioGroup label="Role-play 1 completed">
			<label>
				<input type="radio" class="radio-input" name="rp1Completed" value="yes" bind:group={d.completed} />
				Yes
			</label>
			<label>
				<input type="radio" class="radio-input" name="rp1Completed" value="no" bind:group={d.completed} />
				No
			</label>
		</RadioGroup>
	</Field>
</Fieldset>
