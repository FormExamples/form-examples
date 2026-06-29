<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const p = assessment.data.patientIdentification;

	const sexOptions = [
		{ value: 'male', label: 'Male' },
		{ value: 'female', label: 'Female' },
		{ value: 'unknown', label: 'Unknown' }
	];
</script>

<Fieldset
	title="Patient Identification"
	description="Identify the patient and a contact person who can be reached on their behalf."
>
	<TextInput
		label="Patient name (LAST, First)"
		name="patientName"
		bind:value={p.patientName}
		placeholder="e.g. DOE, Jane"
		required
	/>

	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<TextInput
			label="Date of birth"
			name="patientDob"
			type="date"
			bind:value={p.dateOfBirth}
		/>
		<NumberInput
			label="Age"
			name="patientAge"
			bind:value={p.age}
			min={0}
			max={130}
			unit="years"
		/>
	</div>

	<RadioGroup
		label="Sex"
		name="patientSex"
		options={sexOptions}
		bind:value={p.sex}
		required
	/>

	<TextInput
		label="Patient contact information"
		name="patientContact"
		bind:value={p.patientContactInformation}
		placeholder="Phone, address, email, etc."
	/>

	<h3 class="mt-6 mb-2 text-base font-semibold text-base-content">Patient's contact person</h3>
	<TextInput
		label="Contact person name"
		name="contactPersonName"
		bind:value={p.contactPerson.name}
	/>
	<TextInput
		label="Contact person information"
		name="contactPersonInfo"
		bind:value={p.contactPerson.contactInformation}
		placeholder="Phone, relationship, etc."
	/>
</Fieldset>
