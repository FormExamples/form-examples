<script lang="ts">
	import { application } from '$lib/stores/application.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const p = application.data.practitioner;

	const roleOptions = [
		{ value: 'gp', label: 'General practitioner (GP)' },
		{ value: 'hospital-doctor', label: 'Hospital doctor' },
		{ value: 'nurse-practitioner', label: 'Nurse practitioner' },
		{ value: 'pharmacist-prescriber', label: 'Pharmacist prescriber' },
		{ value: 'other', label: 'Other' }
	];

	const registrationBodyOptions = [
		{ value: 'GMC', label: 'GMC (General Medical Council)' },
		{ value: 'NMC', label: 'NMC (Nursing & Midwifery Council)' },
		{ value: 'HCPC', label: 'HCPC (Health & Care Professions Council)' },
		{ value: 'GPhC', label: 'GPhC (General Pharmaceutical Council)' },
		{ value: 'other', label: 'Other' }
	];
</script>

<Fieldset
	title="Practitioner identification"
	description="The FP92A must be completed by a registered medical practitioner or health professional with access to the patient's medical records."
>
	<TextInput label="Practitioner full name" name="practitionerName" bind:value={p.name} required />

	<Select
		label="Role"
		name="practitionerRole"
		options={roleOptions}
		bind:value={p.role}
		required
	/>

	<div class="grid grid-cols-1 gap-x-4 md:grid-cols-2">
		<Select
			label="Registration body"
			name="practitionerRegistrationBody"
			options={registrationBodyOptions}
			bind:value={p.registrationBody}
			required
		/>
		<TextInput
			label="Registration number"
			name="practitionerRegistrationNumber"
			bind:value={p.registrationNumber}
			placeholder="e.g. 1234567"
			required
		/>
	</div>

	<TextInput
		label="Practice / surgery name"
		name="practiceName"
		bind:value={p.practiceName}
		required
	/>

	<div class="grid grid-cols-1 gap-x-4 md:grid-cols-2">
		<TextInput
			label="Practice code"
			name="practiceCode"
			bind:value={p.practiceCode}
			placeholder="NHS practice code"
		/>
		<TextInput
			label="Practitioner code"
			name="practitionerCode"
			bind:value={p.practitionerCode}
			placeholder="NHS practitioner code"
		/>
	</div>

	<TextAreaInput
		label="Practice postal address"
		name="practiceAddress"
		bind:value={p.postalAddressAsFullText}
		rows={3}
	/>

	<div class="grid grid-cols-1 gap-x-4 md:grid-cols-2">
		<TextInput label="Postcode" name="practitionerPostcode" bind:value={p.postcode} />
		<TextInput label="Telephone" name="practitionerPhone" type="tel" bind:value={p.phone} />
	</div>

	<TextInput
		label="Email"
		name="practitionerEmail"
		type="email"
		bind:value={p.email}
		placeholder="Optional"
	/>

	<TextInput
		label="Date of completion"
		name="practitionerCompletionDate"
		type="date"
		bind:value={p.completionDate}
		required
	/>
</Fieldset>
