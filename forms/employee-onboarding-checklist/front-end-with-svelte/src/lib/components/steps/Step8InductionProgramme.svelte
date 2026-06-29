<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const d = assessment.data.inductionProgramme;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Induction Programme" description="Corporate and local induction, orientation and buddy.">
	<div class="field-grid">
		<RadioGroup name="corporateInductionCompleted" label="Corporate induction completed?" options={yesNo} bind:value={d.corporateInductionCompleted} />
		<div class="field">
			<label class="label" for="corporateInductionDate">Corporate induction date</label>
			<DateInput label="Corporate induction date" bind:value={d.corporateInductionDate} {...{ id: 'corporateInductionDate' }} />
		</div>
	</div>
	<div class="field-grid">
		<RadioGroup name="localInductionCompleted" label="Local induction completed?" options={yesNo} bind:value={d.localInductionCompleted} />
		<div class="field">
			<label class="label" for="localInductionDate">Local induction date</label>
			<DateInput label="Local induction date" bind:value={d.localInductionDate} {...{ id: 'localInductionDate' }} />
		</div>
	</div>
	<RadioGroup name="departmentTourCompleted" label="Department tour completed?" options={yesNo} bind:value={d.departmentTourCompleted} />
	<RadioGroup name="introducedToTeam" label="Introduced to team?" options={yesNo} bind:value={d.introducedToTeam} />
	<RadioGroup name="emergencyProceduresBriefed" label="Emergency procedures briefed?" options={yesNo} bind:value={d.emergencyProceduresBriefed} />
	<RadioGroup name="policiesHandbookReceived" label="Policies handbook received?" options={yesNo} bind:value={d.policiesHandbookReceived} />
	<div class="field-grid">
		<RadioGroup name="buddyAssigned" label="Buddy assigned?" options={yesNo} bind:value={d.buddyAssigned} />
		<TextInput name="buddyName" label="Buddy name" bind:value={d.buddyName} />
	</div>

	<TextAreaInput name="inductionProgrammeNotes" label="Notes" rows={3} bind:value={d.inductionProgrammeNotes} />
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
