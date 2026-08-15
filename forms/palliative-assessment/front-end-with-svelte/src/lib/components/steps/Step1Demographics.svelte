<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const d = assessment.data.demographics;

	const sexOptions = [
		{ value: 'male', label: 'Male' },
		{ value: 'female', label: 'Female' },
		{ value: 'other', label: 'Other' }
	];
</script>

<Fieldset legend="Demographics">
	<p class="hint">Patient identity, the assessment context, and who is reporting.</p>

	<div class="field-grid">
		<Field label="First name" required inputId="firstName">
			<TextInput id="firstName" label="First name" required bind:value={d.firstName} />
		</Field>
		<Field label="Last name" required inputId="lastName">
			<TextInput id="lastName" label="Last name" required bind:value={d.lastName} />
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Date of birth" required inputId="dob">
			<DateInput id="dob" label="Date of birth" required bind:value={d.dateOfBirth} />
		</Field>
		<Field label="NHS / MRN number" inputId="nhsOrMrnNumber">
			<TextInput id="nhsOrMrnNumber" label="NHS / MRN number" placeholder="e.g. 943 476 5919" bind:value={d.nhsOrMrnNumber} />
		</Field>
	</div>

	<Field label="Sex">
		<RadioGroup label="Sex">
			{#each sexOptions as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="sex" value={opt.value} bind:group={d.sex} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<div class="field-grid">
		<Field label="Preferred language" inputId="preferredLanguage">
			<TextInput id="preferredLanguage" label="Preferred language" bind:value={d.preferredLanguage} />
		</Field>
		<Field label="Ethnicity" inputId="ethnicity">
			<TextInput id="ethnicity" label="Ethnicity" bind:value={d.ethnicity} />
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Reporter role" inputId="reporterRole">
			<Select id="reporterRole" label="Reporter role" bind:value={d.reporterRole}>
				<option value="">-- Select --</option>
				<option value="patient">Patient</option>
				<option value="carer">Carer</option>
				<option value="clinician">Clinician</option>
				<option value="family">Family member</option>
			</Select>
		</Field>
		<Field label="Reporter name" inputId="reporterName">
			<TextInput id="reporterName" label="Reporter name" bind:value={d.reporterName} />
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Assessment date" inputId="assessmentDate">
			<DateInput id="assessmentDate" label="Assessment date" bind:value={d.assessmentDate} />
		</Field>
		<Field label="Assessment setting" inputId="assessmentSetting">
			<TextInput id="assessmentSetting" label="Assessment setting" placeholder="e.g. Home, Hospice, Hospital, Care home" bind:value={d.assessmentSetting} />
		</Field>
	</div>
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
