<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const d = assessment.data.signOffCompliance;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Sign-off & Compliance" description="Policy acknowledgements and final sign-off.">
	<RadioGroup name="confidentialityAgreementSigned" label="Confidentiality agreement signed?" options={yesNo} bind:value={d.confidentialityAgreementSigned} />
	<RadioGroup name="codeOfConductSigned" label="Code of conduct signed?" options={yesNo} bind:value={d.codeOfConductSigned} />
	<RadioGroup name="socialMediaPolicyAcknowledged" label="Social media policy acknowledged?" options={yesNo} bind:value={d.socialMediaPolicyAcknowledged} />
	<RadioGroup name="itAcceptableUseSigned" label="IT acceptable use signed?" options={yesNo} bind:value={d.itAcceptableUseSigned} />
	<RadioGroup name="gdprTrainingCompleted" label="GDPR training completed?" options={yesNo} bind:value={d.gdprTrainingCompleted} />
	<RadioGroup name="dutyOfCandourBriefed" label="Duty of candour briefed?" options={yesNo} bind:value={d.dutyOfCandourBriefed} />
	<RadioGroup name="whistleblowingPolicyBriefed" label="Whistleblowing policy briefed?" options={yesNo} bind:value={d.whistleblowingPolicyBriefed} />

	<div class="field-grid">
		<RadioGroup name="employeeSignedOff" label="Employee signed off?" options={yesNo} bind:value={d.employeeSignedOff} />
		<div class="field">
			<label class="label" for="employeeSignOffDate">Employee sign-off date</label>
			<DateInput label="Employee sign-off date" bind:value={d.employeeSignOffDate} {...{ id: 'employeeSignOffDate' }} />
		</div>
	</div>
	<div class="field-grid">
		<RadioGroup name="managerSignedOff" label="Manager signed off?" options={yesNo} bind:value={d.managerSignedOff} />
		<div class="field">
			<label class="label" for="managerSignOffDate">Manager sign-off date</label>
			<DateInput label="Manager sign-off date" bind:value={d.managerSignOffDate} {...{ id: 'managerSignOffDate' }} />
		</div>
	</div>
	<TextInput name="managerSignOffName" label="Manager sign-off name" bind:value={d.managerSignOffName} />

	<TextAreaInput name="signOffComplianceNotes" label="Notes" rows={3} bind:value={d.signOffComplianceNotes} />
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
