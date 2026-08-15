<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import EmailInput from '#lib/components/ui/EmailInput.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const d = assessment.data.probationSupervision;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Probation & Supervision" description="Probation period, line management and supervision plan.">
	<div class="field-grid field-grid-3">
		<NumberInput name="probationPeriodMonths" label="Probation period (months)" min={0} max={24} bind:value={d.probationPeriodMonths} />
		<div class="field">
			<label class="label" for="probationStartDate">Probation start date</label>
			<DateInput label="Probation start date" bind:value={d.probationStartDate} {...{ id: 'probationStartDate' }} />
		</div>
		<div class="field">
			<label class="label" for="probationEndDate">Probation end date</label>
			<DateInput label="Probation end date" bind:value={d.probationEndDate} {...{ id: 'probationEndDate' }} />
		</div>
	</div>
	<div class="field-grid">
		<TextInput name="lineManagerName" label="Line manager name" bind:value={d.lineManagerName} />
		<div class="field">
			<label class="label" for="lineManagerEmail">Line manager email</label>
			<EmailInput label="Line manager email" bind:value={d.lineManagerEmail} {...{ id: 'lineManagerEmail' }} />
		</div>
	</div>
	<div class="field-grid">
		<TextInput name="supervisorName" label="Supervisor name" bind:value={d.supervisorName} />
		<Select
			name="supervisionFrequency"
			label="Supervision frequency"
			bind:value={d.supervisionFrequency}
			options={[
				{ value: 'weekly', label: 'Weekly' },
				{ value: 'fortnightly', label: 'Fortnightly' },
				{ value: 'monthly', label: 'Monthly' },
				{ value: 'quarterly', label: 'Quarterly' }
			]}
		/>
	</div>
	<div class="field-grid">
		<div class="field">
			<label class="label" for="firstSupervisionDate">First supervision date</label>
			<DateInput label="First supervision date" bind:value={d.firstSupervisionDate} {...{ id: 'firstSupervisionDate' }} />
		</div>
		<RadioGroup name="objectivesSet" label="Objectives set?" options={yesNo} bind:value={d.objectivesSet} />
	</div>
	<div class="field-grid">
		<RadioGroup name="appraisalDateAgreed" label="Appraisal date agreed?" options={yesNo} bind:value={d.appraisalDateAgreed} />
		<div class="field">
			<label class="label" for="appraisalDate">Appraisal date</label>
			<DateInput label="Appraisal date" bind:value={d.appraisalDate} {...{ id: 'appraisalDate' }} />
		</div>
	</div>

	<TextAreaInput name="probationSupervisionNotes" label="Notes" rows={3} bind:value={d.probationSupervisionNotes} />
</Fieldset>

<style>
	.field-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}
	.field-grid.field-grid-3 {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}
	@media (max-width: 640px) {
		.field-grid,
		.field-grid.field-grid-3 {
			grid-template-columns: 1fr;
		}
	}
</style>
