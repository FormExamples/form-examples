<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import SectionCard from '$lib/components/ui/SectionCard.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const p = assessment.data.patientIdentification;

	const sexOptions = [
		{ value: 'male', label: 'Male' },
		{ value: 'female', label: 'Female' },
		{ value: 'unknown', label: 'Unknown' }
	];
</script>

<SectionCard
	title="Patient Identification"
	description="Identify the patient being discharged from the referral facility back to primary care."
>
	<TextInput
		label="Patient name (LAST, First)"
		name="patientName"
		bind:value={p.patientName}
		placeholder="DOE, Jane"
		required
	/>

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
		name="patientContact"
		bind:value={p.patientContact}
		placeholder="Phone number, address, or other contact"
		required
	/>

	<h3 class="mt-6 mb-2 text-base font-semibold text-gray-800">Emergency contact person</h3>
	<TextInput
		label="Name"
		name="emergencyContactName"
		bind:value={p.emergencyContact.name}
		required
	/>
	<TextInput
		label="Contact information"
		name="emergencyContactInformation"
		bind:value={p.emergencyContact.contactInformation}
		placeholder="Phone, relationship, etc."
		required
	/>
</SectionCard>
