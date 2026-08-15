<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const p = assessment.data.patientIdentification;

	const sexOptions = [
		{ value: 'male', label: 'Male' },
		{ value: 'female', label: 'Female' },
		{ value: 'unknown', label: 'Unknown' }
	];
</script>

<Fieldset
	title="Patient Identification"
	description="Identify the patient being referred. This information must be sent with the patient to the referral facility."
>
	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<TextInput
			label="Patient last name (family name)"
			name="patientLastName"
			bind:value={p.patientLastName}
			placeholder="DOE"
			required
		/>
		<TextInput
			label="Patient first name (given name)"
			name="patientFirstName"
			bind:value={p.patientFirstName}
			placeholder="Jane"
			required
		/>
	</div>

	<TextInput
		label="Date of birth"
		name="dateOfBirth"
		type="date"
		bind:value={p.dateOfBirth}
		required
	/>

	<RadioGroup label="Sex" name="sex" options={sexOptions} bind:value={p.sex} required />

	<TextInput
		label="Patient contact information"
		name="patientContactInformation"
		bind:value={p.patientContactInformation}
		placeholder="Phone number, address, or other contact"
	/>

	<h3 class="mt-6 mb-2 text-base font-semibold text-base-content">Emergency contact person</h3>
	<TextInput
		label="Name"
		name="emergencyContactName"
		bind:value={p.emergencyContact.name}
	/>
	<TextInput
		label="Contact information"
		name="emergencyContactInformation"
		bind:value={p.emergencyContact.contactInformation}
		placeholder="Phone, relationship, etc."
	/>
</Fieldset>
