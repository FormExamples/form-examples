<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const d = assessment.data.preEmploymentChecks;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Pre-Employment Checks" description="DBS, right to work, references and identity verification.">
	<Select
		name="dbsCheckStatus"
		label="DBS check status"
		bind:value={d.dbsCheckStatus}
		options={[
			{ value: 'not-started', label: 'Not started' },
			{ value: 'applied', label: 'Applied' },
			{ value: 'received', label: 'Received' },
			{ value: 'cleared', label: 'Cleared' }
		]}
	/>
	<div class="field-grid">
		<TextInput name="dbsCertificateNumber" label="DBS certificate number" bind:value={d.dbsCertificateNumber} />
		<div class="field">
			<label class="label" for="dbsCheckDate">DBS check date</label>
			<DateInput label="DBS check date" bind:value={d.dbsCheckDate} {...{ id: 'dbsCheckDate' }} />
		</div>
	</div>
	<RadioGroup name="dbsUpdateServiceRegistered" label="Registered with DBS Update Service?" options={yesNo} bind:value={d.dbsUpdateServiceRegistered} />

	<RadioGroup name="rightToWorkVerified" label="Right to work verified?" options={yesNo} bind:value={d.rightToWorkVerified} />
	<div class="field-grid">
		<TextInput name="rightToWorkDocumentType" label="Right to work document type" bind:value={d.rightToWorkDocumentType} />
		<div class="field">
			<label class="label" for="rightToWorkExpiryDate">Right to work expiry date</label>
			<DateInput label="Right to work expiry date" bind:value={d.rightToWorkExpiryDate} {...{ id: 'rightToWorkExpiryDate' }} />
		</div>
	</div>

	<div class="field-grid">
		<NumberInput name="referencesReceived" label="References received" min={0} max={10} bind:value={d.referencesReceived} />
		<NumberInput name="referencesRequired" label="References required" min={0} max={10} bind:value={d.referencesRequired} />
	</div>
	<RadioGroup name="referencesSatisfactory" label="References satisfactory?" options={yesNo} bind:value={d.referencesSatisfactory} />
	<RadioGroup name="identityVerified" label="Identity verified?" options={yesNo} bind:value={d.identityVerified} />

	<TextAreaInput name="preEmploymentNotes" label="Notes" rows={3} bind:value={d.preEmploymentNotes} />
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
