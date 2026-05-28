<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const gp = assessment.data.healthcareProfessionals.gp;
	const con = assessment.data.healthcareProfessionals.consultant;
</script>

<Fieldset
	title="Part B — Healthcare Professionals"
	description="Details of the healthcare professionals who care for the condition you are declaring. Provide your GP at minimum; consultant details are optional but helpful."
>
	<h3 class="mb-3 text-lg font-semibold text-gray-900">GP details</h3>
	<TextInput label="GP name" name="gpName" bind:value={gp.name} required />
	<TextInput
		label="Surgery name"
		name="gpSurgeryName"
		bind:value={gp.surgeryName}
		required
	/>
	<TextAreaInput label="Address" name="gpAddress" bind:value={gp.address} rows={2} />
	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<TextInput label="Town" name="gpTown" bind:value={gp.town} />
		<TextInput label="Postcode" name="gpPostcode" bind:value={gp.postcode} />
	</div>
	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<TextInput
			label="Contact number"
			name="gpContactNumber"
			type="tel"
			bind:value={gp.contactNumber}
		/>
		<TextInput label="Email" name="gpEmail" type="email" bind:value={gp.email} />
	</div>
	<TextInput
		label="Date last seen for this condition"
		name="gpDateLastSeen"
		type="date"
		bind:value={gp.dateLastSeen}
	/>

	<hr class="my-6 border-gray-200" />

	<h3 class="mb-3 text-lg font-semibold text-gray-900">Consultant details (if any)</h3>
	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<TextInput label="Consultant name" name="conName" bind:value={con.name} />
		<TextInput
			label="Speciality"
			name="conSpeciality"
			bind:value={con.speciality}
			placeholder="e.g. Ophthalmology"
		/>
	</div>
	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<TextInput label="Department" name="conDepartment" bind:value={con.department} />
		<TextInput label="Hospital name" name="conHospitalName" bind:value={con.hospitalName} />
	</div>
	<TextAreaInput label="Address" name="conAddress" bind:value={con.address} rows={2} />
	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<TextInput label="Town" name="conTown" bind:value={con.town} />
		<TextInput label="Postcode" name="conPostcode" bind:value={con.postcode} />
	</div>
	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<TextInput
			label="Contact number"
			name="conContactNumber"
			type="tel"
			bind:value={con.contactNumber}
		/>
		<TextInput label="Email" name="conEmail" type="email" bind:value={con.email} />
	</div>
	<TextInput
		label="Date last seen for this condition"
		name="conDateLastSeen"
		type="date"
		bind:value={con.dateLastSeen}
	/>
</Fieldset>
