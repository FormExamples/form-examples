<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import SectionCard from '$lib/components/ui/SectionCard.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';

	const gp = assessment.data.healthcareProfessionals.gp;
	const c = assessment.data.healthcareProfessionals.consultant;
</script>

<SectionCard
	title="Part B — Healthcare Professionals"
	description="Tell us about the healthcare professionals who treat you for this condition."
>
	<h3 class="mb-3 text-lg font-semibold text-gray-800">GP details</h3>
	<TextInput label="GP name" name="gpName" bind:value={gp.gpName} required />
	<TextInput
		label="Surgery name"
		name="surgeryName"
		bind:value={gp.surgeryName}
		required
	/>
	<TextInput label="Address — line 1" name="gpAddr1" bind:value={gp.addressLine1} />
	<TextInput label="Address — line 2" name="gpAddr2" bind:value={gp.addressLine2} />
	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<TextInput label="Town" name="gpTown" bind:value={gp.town} />
		<TextInput label="Postcode" name="gpPostcode" bind:value={gp.postcode} required />
	</div>
	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<TextInput
			label="Contact number"
			name="gpPhone"
			type="tel"
			bind:value={gp.contactNumber}
		/>
		<TextInput label="Email" name="gpEmail" type="email" bind:value={gp.email} />
	</div>
	<TextInput
		label="Date last seen for this condition"
		name="gpLastSeen"
		type="date"
		bind:value={gp.dateLastSeen}
		required
	/>

	<h3 class="mt-8 mb-3 text-lg font-semibold text-gray-800">Consultant details</h3>
	<p class="mb-3 text-sm text-gray-500">
		Leave blank if you have not seen a consultant for this condition.
	</p>
	<TextInput label="Consultant name" name="consName" bind:value={c.consultantName} />
	<TextInput label="Speciality" name="consSpec" bind:value={c.speciality} />
	<TextInput label="Department" name="consDept" bind:value={c.department} />
	<TextInput label="Hospital name" name="consHosp" bind:value={c.hospitalName} />
	<TextInput label="Address — line 1" name="consAddr1" bind:value={c.addressLine1} />
	<TextInput label="Address — line 2" name="consAddr2" bind:value={c.addressLine2} />
	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<TextInput label="Town" name="consTown" bind:value={c.town} />
		<TextInput label="Postcode" name="consPostcode" bind:value={c.postcode} />
	</div>
	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<TextInput
			label="Contact number"
			name="consPhone"
			type="tel"
			bind:value={c.contactNumber}
		/>
		<TextInput label="Email" name="consEmail" type="email" bind:value={c.email} />
	</div>
	<TextInput
		label="Date last seen for this condition"
		name="consLastSeen"
		type="date"
		bind:value={c.dateLastSeen}
	/>
</SectionCard>
