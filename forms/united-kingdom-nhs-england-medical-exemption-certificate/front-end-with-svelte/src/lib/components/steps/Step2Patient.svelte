<script lang="ts">
	import { application } from '#lib/stores/application.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const p = application.data.patient;

	const titleOptions = [
		{ value: 'Mr', label: 'Mr' },
		{ value: 'Mrs', label: 'Mrs' },
		{ value: 'Miss', label: 'Miss' },
		{ value: 'Ms', label: 'Ms' },
		{ value: 'Mx', label: 'Mx' },
		{ value: 'Dr', label: 'Dr' },
		{ value: 'Prof', label: 'Prof' },
		{ value: 'Rev', label: 'Rev' },
		{ value: 'Other', label: 'Other' }
	];

	const sexOptions = [
		{ value: 'female', label: 'Female' },
		{ value: 'male', label: 'Male' },
		{ value: 'intersex', label: 'Intersex' },
		{ value: 'unknown', label: 'Unknown' }
	];
</script>

<Fieldset
	title="Patient identification"
	description="The patient is the prospective holder of the medical exemption certificate. Capture the full UK postal address and NHS number so NHSBSA can match the patient record."
>
	<div class="grid grid-cols-1 gap-x-4 md:grid-cols-[120px_1fr]">
		<Select label="Title" name="patientTitle" options={titleOptions} bind:value={p.title} />
		<TextInput label="Forenames" name="patientForenames" bind:value={p.forenames} required />
	</div>

	<TextInput label="Surname" name="patientSurname" bind:value={p.surname} required />

	<div class="grid grid-cols-1 gap-x-4 md:grid-cols-2">
		<TextInput
			label="Date of birth"
			name="patientBirthDate"
			type="date"
			bind:value={p.birthDate}
			required
		/>
		<Select label="Sex" name="patientSex" options={sexOptions} bind:value={p.sex} />
	</div>

	<TextAreaInput
		label="Full UK postal address"
		name="patientAddress"
		bind:value={p.postalAddressAsFullText}
		rows={3}
	/>

	<div class="grid grid-cols-1 gap-x-4 md:grid-cols-2">
		<TextInput label="Postcode" name="patientPostcode" bind:value={p.postcode} />
		<TextInput
			label="NHS number"
			name="nhsNumber"
			bind:value={p.unitedKingdomNhsNumber}
			placeholder="10 digits, e.g. 999 012 3456"
			required
		/>
	</div>

	<div class="grid grid-cols-1 gap-x-4 md:grid-cols-2">
		<TextInput label="Telephone" name="patientPhone" type="tel" bind:value={p.phone} />
		<TextInput
			label="Email (optional)"
			name="patientEmail"
			type="email"
			bind:value={p.email}
		/>
	</div>
</Fieldset>
