<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import SectionCard from '$lib/components/ui/SectionCard.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextArea from '$lib/components/ui/TextArea.svelte';

	const p = assessment.data.personalDetails;
</script>

<SectionCard
	title="Part A — About You"
	description="Current driving licence details and any change of details"
>
	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<TextInput
			label="Title"
			name="title"
			bind:value={p.title}
			placeholder="e.g. Mr, Mrs, Ms, Dr"
		/>
		<TextInput label="Full name" name="fullName" bind:value={p.fullName} required />
	</div>

	<TextInput
		label="Date of birth"
		name="dob"
		type="date"
		bind:value={p.dateOfBirth}
		required
	/>

	<TextArea label="Address" name="address" bind:value={p.address} rows={3} />

	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<TextInput label="Postcode" name="postcode" bind:value={p.postcode} required />
		<TextInput
			label="Contact number"
			name="contactNumber"
			type="tel"
			bind:value={p.contactNumber}
		/>
	</div>

	<TextInput label="Email" name="email" type="email" bind:value={p.email} />

	<TextArea
		label="Change of details (optional)"
		name="changeOfDetails"
		bind:value={p.changeOfDetails}
		placeholder="Note any changes (name, address, etc.) since your last licence"
		rows={3}
	/>
</SectionCard>
