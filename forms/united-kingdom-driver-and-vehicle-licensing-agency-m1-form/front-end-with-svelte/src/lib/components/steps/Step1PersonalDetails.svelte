<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import EmailInput from '#lib/components/ui/EmailInput.svelte';
	import TelInput from '#lib/components/ui/TelInput.svelte';

	const p = assessment.data.personalDetails;
</script>

<Fieldset legend="Part A — About You">
	<p class="hint">Current driving licence details and any change of details.</p>

	<div class="field-grid">
		<Field label="Title" inputId="title">
			<TextInput id="title" label="Title" placeholder="e.g. Mr, Mrs, Ms, Dr" bind:value={p.title} />
		</Field>
		<Field label="Full name" required inputId="fullName">
			<TextInput id="fullName" label="Full name" required bind:value={p.fullName} />
		</Field>
	</div>

	<Field label="Date of birth" required inputId="dob">
		<DateInput id="dob" label="Date of birth" required bind:value={p.dateOfBirth} />
	</Field>

	<Field label="Address" inputId="address">
		<TextAreaInput id="address" label="Address" rows={3} bind:value={p.address} />
	</Field>

	<div class="field-grid">
		<Field label="Postcode" required inputId="postcode">
			<TextInput id="postcode" label="Postcode" required bind:value={p.postcode} />
		</Field>
		<Field label="Contact number" inputId="contactNumber">
			<TelInput id="contactNumber" label="Contact number" bind:value={p.contactNumber} />
		</Field>
	</div>

	<Field label="Email" inputId="email">
		<EmailInput id="email" label="Email" bind:value={p.email} />
	</Field>

	<Field label="Change of details (optional)" inputId="changeOfDetails">
		<TextAreaInput
			id="changeOfDetails"
			label="Change of details"
			rows={3}
			placeholder="Note any changes (name, address, etc.) since your last licence"
			bind:value={p.changeOfDetails}
		/>
	</Field>
</Fieldset>

<style>
	.field-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}
	@media (max-width: 640px) {
		.field-grid { grid-template-columns: 1fr; }
	}
</style>
