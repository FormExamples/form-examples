<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const p = assessment.data.personalDetails;
</script>

<Fieldset
	title="Part A — About You"
	description="Your current personal details. Use the change-of-details box if anything has recently changed."
>
	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-3">
		<TextInput label="Title" name="title" bind:value={p.title} placeholder="e.g. Mr, Ms, Dr" />
		<div class="sm:col-span-2">
			<TextInput label="Full name" name="fullName" bind:value={p.fullName} required />
		</div>
	</div>

	<TextInput
		label="Date of birth"
		name="dob"
		type="date"
		bind:value={p.dateOfBirth}
		required
	/>

	<TextAreaInput label="Address" name="address" bind:value={p.address} rows={3} required />

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

	<TextAreaInput
		label="Change of details (optional)"
		name="changeOfDetails"
		bind:value={p.changeOfDetails}
		placeholder="If your name, address, or contact details have changed, write the changes here."
		rows={3}
	/>
</Fieldset>
