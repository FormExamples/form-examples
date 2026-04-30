<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import SectionCard from '$lib/components/ui/SectionCard.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextArea from '$lib/components/ui/TextArea.svelte';

	const d = assessment.data.personalDetails;
</script>

<SectionCard
	title="Part A — About You"
	description="Your current driving licence details. Tell us about any change of details since your licence was issued."
>
	<TextInput
		label="Title"
		name="title"
		bind:value={d.title}
		placeholder="e.g. Mr, Mrs, Ms, Mx, Dr"
		required
	/>
	<TextInput label="Full name" name="fullName" bind:value={d.fullName} required />
	<TextInput
		label="Date of birth"
		name="dob"
		type="date"
		bind:value={d.dateOfBirth}
		required
	/>

	<TextInput
		label="Address — line 1"
		name="addr1"
		bind:value={d.addressLine1}
		required
	/>
	<TextInput label="Address — line 2" name="addr2" bind:value={d.addressLine2} />
	<TextInput label="Address — line 3" name="addr3" bind:value={d.addressLine3} />

	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<TextInput label="Postcode" name="postcode" bind:value={d.postcode} required />
		<TextInput
			label="Contact number"
			name="contactNumber"
			type="tel"
			bind:value={d.contactNumber}
			required
		/>
	</div>

	<TextInput label="Email" name="email" type="email" bind:value={d.email} />

	<TextArea
		label="Change of details (optional)"
		name="changeOfDetails"
		bind:value={d.changeOfDetails}
		placeholder="If your name, address, or other licence details have changed, please describe the change here."
		rows={3}
	/>
</SectionCard>
