<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import EmailInput from '$lib/components/ui/EmailInput.svelte';
	import TelInput from '$lib/components/ui/TelInput.svelte';

	const d = assessment.data.personalDetails;
</script>

<Fieldset legend="Part A — About You">
	<p class="hint">Your current driving licence details. Tell us about any change of details since your licence was issued.</p>

	<Field label="Title" required inputId="title">
		<TextInput id="title" label="Title" required placeholder="e.g. Mr, Mrs, Ms, Mx, Dr" bind:value={d.title} />
	</Field>
	<Field label="Full name" required inputId="fullName">
		<TextInput id="fullName" label="Full name" required bind:value={d.fullName} />
	</Field>
	<Field label="Date of birth" required inputId="dob">
		<DateInput id="dob" label="Date of birth" required bind:value={d.dateOfBirth} />
	</Field>

	<Field label="Address — line 1" required inputId="addr1">
		<TextInput id="addr1" label="Address — line 1" required bind:value={d.addressLine1} />
	</Field>
	<Field label="Address — line 2" inputId="addr2">
		<TextInput id="addr2" label="Address — line 2" bind:value={d.addressLine2} />
	</Field>
	<Field label="Address — line 3" inputId="addr3">
		<TextInput id="addr3" label="Address — line 3" bind:value={d.addressLine3} />
	</Field>

	<div class="field-grid">
		<Field label="Postcode" required inputId="postcode">
			<TextInput id="postcode" label="Postcode" required bind:value={d.postcode} />
		</Field>
		<Field label="Contact number" required inputId="contactNumber">
			<TelInput id="contactNumber" label="Contact number" required bind:value={d.contactNumber} />
		</Field>
	</div>

	<Field label="Email" inputId="email">
		<EmailInput id="email" label="Email" bind:value={d.email} />
	</Field>

	<Field label="Change of details (optional)" inputId="changeOfDetails">
		<TextAreaInput
			id="changeOfDetails"
			label="Change of details"
			rows={3}
			placeholder="If your name, address, or other licence details have changed, please describe the change here."
			bind:value={d.changeOfDetails}
		/>
	</Field>
</Fieldset>

<style>
	.field-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
	@media (max-width: 640px) { .field-grid { grid-template-columns: 1fr; } }
</style>
