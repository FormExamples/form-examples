<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import { OPTIONS } from '#lib/config/options.js';
	import { assessmentStore } from '#lib/stores/assessment.svelte.js';

	const d = assessmentStore.data;
</script>

<Fieldset legend="2. Patient Identification and Referral">
	<p class="hint">Who the patient is, who referred them, and why.</p>

	<Field label="First name" inputId="patient-firstName" required>
		<TextInput id="patient-firstName" label="First name" bind:value={d.patient.firstName} required />
	</Field>
	<Field label="Last name" inputId="patient-lastName" required>
		<TextInput id="patient-lastName" label="Last name" bind:value={d.patient.lastName} required />
	</Field>
	<Field label="Date of birth" inputId="patient-birthDate" description="Used for the age-banded GLIM body mass index thresholds and the paediatric flag.">
		<DateInput id="patient-birthDate" label="Date of birth" bind:value={d.patient.birthDate} />
	</Field>
	<Field label="Sex" inputId="patient-sex">
		<Select id="patient-sex" label="Sex" bind:value={d.patient.sex}>
			<option value="">— Select —</option>
			{#each OPTIONS.sex as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="NHS number" inputId="patient-nhsNumber">
		<TextInput id="patient-nhsNumber" label="NHS number"
			placeholder="NNN NNN NNNN" bind:value={d.patient.nhsNumber} />
	</Field>
	<Field label="Preferred language" inputId="patient-preferredLanguage">
		<TextInput id="patient-preferredLanguage" label="Preferred language" bind:value={d.patient.preferredLanguage} />
	</Field>
	<Field label="Referral source" inputId="patient-referralSource">
		<Select id="patient-referralSource" label="Referral source" bind:value={d.patient.referralSource}>
			<option value="">— Select —</option>
			{#each OPTIONS.referralSource as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Referral date" inputId="patient-referralDate">
		<DateInput id="patient-referralDate" label="Referral date" bind:value={d.patient.referralDate} />
	</Field>
	<Field label="Reason for referral" inputId="patient-referralReason" required>
		<TextAreaInput id="patient-referralReason" label="Reason for referral" rows={2} bind:value={d.patient.referralReason} required />
	</Field>
	<Field label="Primary presenting condition" inputId="patient-primaryCondition">
		<TextInput id="patient-primaryCondition" label="Primary presenting condition" bind:value={d.patient.primaryCondition} />
	</Field>
	<Field label="Consent to record the assessment" inputId="patient-consentToRecord">
		<Select id="patient-consentToRecord" label="Consent to record the assessment" bind:value={d.patient.consentToRecord}>
			<option value="">— Select —</option>
			{#each [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Accompanied by" inputId="patient-accompaniedBy">
		<TextInput id="patient-accompaniedBy" label="Accompanied by"
			placeholder="Relative, carer, advocate" bind:value={d.patient.accompaniedBy} />
	</Field>
</Fieldset>
