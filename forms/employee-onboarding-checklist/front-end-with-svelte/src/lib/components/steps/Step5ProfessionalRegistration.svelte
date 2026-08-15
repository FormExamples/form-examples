<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const d = assessment.data.professionalRegistration;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Professional Registration" description="Regulatory body registration and revalidation.">
	<RadioGroup name="registrationRequired" label="Professional registration required?" options={yesNo} bind:value={d.registrationRequired} />

	{#if d.registrationRequired === 'yes'}
		<Select
			name="regulatoryBody"
			label="Regulatory body"
			bind:value={d.regulatoryBody}
			options={[
				{ value: 'nmc', label: 'NMC' },
				{ value: 'gmc', label: 'GMC' },
				{ value: 'hcpc', label: 'HCPC' },
				{ value: 'gdc', label: 'GDC' },
				{ value: 'gphc', label: 'GPhC' },
				{ value: 'other', label: 'Other' }
			]}
		/>
		{#if d.regulatoryBody === 'other'}
			<TextInput name="regulatoryBodyOther" label="Other regulatory body" bind:value={d.regulatoryBodyOther} />
		{/if}
		<div class="field-grid">
			<TextInput name="registrationNumber" label="Registration number" bind:value={d.registrationNumber} />
			<div class="field">
				<label class="label" for="registrationExpiryDate">Registration expiry date</label>
				<DateInput label="Registration expiry date" bind:value={d.registrationExpiryDate} {...{ id: 'registrationExpiryDate' }} />
			</div>
		</div>
		<RadioGroup name="registrationVerified" label="Registration verified?" options={yesNo} bind:value={d.registrationVerified} />
		<RadioGroup name="registrationConditions" label="Registration has conditions?" options={yesNo} bind:value={d.registrationConditions} />
		{#if d.registrationConditions === 'yes'}
			<TextAreaInput name="registrationConditionDetails" label="Condition details" rows={2} bind:value={d.registrationConditionDetails} />
		{/if}
		<div class="field-grid">
			<div class="field">
				<label class="label" for="revalidationDate">Revalidation date</label>
				<DateInput label="Revalidation date" bind:value={d.revalidationDate} {...{ id: 'revalidationDate' }} />
			</div>
			<Select
				name="indemnityInsurance"
				label="Indemnity insurance"
				bind:value={d.indemnityInsurance}
				options={[
					{ value: 'yes', label: 'Yes' },
					{ value: 'no', label: 'No' },
					{ value: 'na', label: 'N/A' }
				]}
			/>
		</div>
	{/if}

	<TextAreaInput name="professionalRegistrationNotes" label="Notes" rows={3} bind:value={d.professionalRegistrationNotes} />
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
