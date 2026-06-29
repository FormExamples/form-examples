<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const d = assessment.data.rolePlay2;
</script>

<Fieldset legend="Role-play 2 — Clinical explanation">
	<p class="hint">
		The candidate explains a diagnosis or management plan to the patient. Record the scenario
		context and the assessor's observations.
	</p>

	<Field label="Clinical setting" inputId="rp2Setting" description="e.g. Outpatient clinic, emergency department">
		<TextInput id="rp2Setting" label="Clinical setting" bind:value={d.setting} />
	</Field>

	<Field label="Patient role" inputId="rp2PatientRole" description="The role played by the interlocutor">
		<TextInput id="rp2PatientRole" label="Patient role" bind:value={d.patientRole} />
	</Field>

	<Field label="Candidate task" inputId="rp2CandidateTask">
		<TextAreaInput id="rp2CandidateTask" label="Candidate task" rows={2} bind:value={d.candidateTask} />
	</Field>

	<Field label="Assessor notes" inputId="rp2Notes">
		<TextAreaInput id="rp2Notes" label="Assessor notes" rows={3} bind:value={d.notes} />
	</Field>

	<Field label="Role-play completed">
		<RadioGroup label="Role-play 2 completed">
			<label>
				<input type="radio" class="radio-input" name="rp2Completed" value="yes" bind:group={d.completed} />
				Yes
			</label>
			<label>
				<input type="radio" class="radio-input" name="rp2Completed" value="no" bind:group={d.completed} />
				No
			</label>
		</RadioGroup>
	</Field>
</Fieldset>
