<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import SectionCard from '$lib/components/ui/SectionCard.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextArea from '$lib/components/ui/TextArea.svelte';

	const gp = assessment.data.healthcareProfessionals.gp;
	const con = assessment.data.healthcareProfessionals.consultant;
</script>

<SectionCard
	title="Part B — Healthcare Professional"
	description="GP and consultant details for your mental health condition"
>
	<h3 class="mb-3 text-base font-semibold text-gray-900">GP details</h3>

	<TextInput label="GP name" name="gpName" bind:value={gp.gpName} />
	<TextInput label="Surgery name" name="gpSurgeryName" bind:value={gp.surgeryName} />
	<TextArea label="Address" name="gpAddress" bind:value={gp.address} rows={2} />

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
		<TextInput
			label="Email (if known)"
			name="gpEmail"
			type="email"
			bind:value={gp.email}
		/>
	</div>

	<TextInput
		label="Date last seen for this condition"
		name="gpDateLastSeen"
		type="date"
		bind:value={gp.dateLastSeen}
	/>

	<hr class="my-6 border-gray-200" />

	<h3 class="mb-3 text-base font-semibold text-gray-900">Consultant details</h3>

	<TextInput
		label="Consultant name"
		name="consultantName"
		bind:value={con.consultantName}
	/>
	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<TextInput label="Speciality" name="speciality" bind:value={con.speciality} />
		<TextInput label="Department" name="department" bind:value={con.department} />
	</div>
	<TextInput
		label="Hospital name"
		name="hospitalName"
		bind:value={con.hospitalName}
	/>
	<TextArea
		label="Address"
		name="consultantAddress"
		bind:value={con.address}
		rows={2}
	/>

	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<TextInput label="Town" name="consultantTown" bind:value={con.town} />
		<TextInput
			label="Postcode"
			name="consultantPostcode"
			bind:value={con.postcode}
		/>
	</div>

	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<TextInput
			label="Contact number"
			name="consultantContactNumber"
			type="tel"
			bind:value={con.contactNumber}
		/>
		<TextInput
			label="Email (if known)"
			name="consultantEmail"
			type="email"
			bind:value={con.email}
		/>
	</div>

	<TextInput
		label="Date last seen for this condition"
		name="consultantDateLastSeen"
		type="date"
		bind:value={con.dateLastSeen}
	/>
</SectionCard>
