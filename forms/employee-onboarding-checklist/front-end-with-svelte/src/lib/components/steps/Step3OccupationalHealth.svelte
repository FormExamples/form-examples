<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const d = assessment.data.occupationalHealth;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Occupational Health" description="Health clearance, immunisations and fitness to work.">
	<RadioGroup name="ohQuestionnaireSubmitted" label="OH questionnaire submitted?" options={yesNo} bind:value={d.ohQuestionnaireSubmitted} />
	<div class="field-grid">
		<RadioGroup name="ohClearanceReceived" label="OH clearance received?" options={yesNo} bind:value={d.ohClearanceReceived} />
		<div class="field">
			<label class="label" for="ohClearanceDate">OH clearance date</label>
			<DateInput label="OH clearance date" bind:value={d.ohClearanceDate} {...{ id: 'ohClearanceDate' }} />
		</div>
	</div>

	<RadioGroup name="ohRestrictions" label="OH restrictions apply?" options={yesNo} bind:value={d.ohRestrictions} />
	{#if d.ohRestrictions === 'yes'}
		<TextAreaInput name="ohRestrictionDetails" label="Restriction details" rows={2} bind:value={d.ohRestrictionDetails} />
	{/if}

	<Select
		name="hepatitisBStatus"
		label="Hepatitis B status"
		bind:value={d.hepatitisBStatus}
		options={[
			{ value: 'immune', label: 'Immune' },
			{ value: 'non-immune', label: 'Non-immune' },
			{ value: 'vaccinating', label: 'Vaccinating' },
			{ value: 'declined', label: 'Declined' }
		]}
	/>
	<Select
		name="tbScreeningStatus"
		label="TB screening status"
		bind:value={d.tbScreeningStatus}
		options={[
			{ value: 'not-required', label: 'Not required' },
			{ value: 'required', label: 'Required' },
			{ value: 'completed', label: 'Completed' },
			{ value: 'referred', label: 'Referred' }
		]}
	/>
	<Select
		name="immunisationStatus"
		label="Immunisation status"
		bind:value={d.immunisationStatus}
		options={[
			{ value: 'complete', label: 'Complete' },
			{ value: 'in-progress', label: 'In progress' },
			{ value: 'incomplete', label: 'Incomplete' }
		]}
	/>

	<RadioGroup name="fitToWork" label="Fit to work?" options={yesNo} bind:value={d.fitToWork} />
	<TextAreaInput name="occupationalHealthNotes" label="Notes" rows={3} bind:value={d.occupationalHealthNotes} />
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
