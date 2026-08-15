<script lang="ts">
	import { store } from '#lib/stores/fitnote.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';

	const p = store.data.patient;
</script>

<Fieldset legend="Patient identification">
	<p class="hint">Details of the patient the fit note is issued to.</p>

	<div class="field-grid">
		<Field label="Patient name" required inputId="patient-name">
			<TextInput id="patient-name" label="Patient name" required bind:value={p.name} />
		</Field>
		<Field label="Date of birth" inputId="patient-dob">
			<DateInput id="patient-dob" label="Date of birth" bind:value={p.birthDate} />
		</Field>
		<Field
			label="NHS number"
			description="Ten-digit identifier, optionally formatted with spaces."
			inputId="patient-nhs"
		>
			<TextInput id="patient-nhs" label="NHS number" bind:value={p.unitedKingdomNhsNumber} />
		</Field>
		<Field label="Postcode" inputId="patient-postcode">
			<TextInput id="patient-postcode" label="Postcode" bind:value={p.postcode} />
		</Field>
	</div>

	<Field label="Postal address" inputId="patient-address">
		<TextAreaInput
			id="patient-address"
			label="Postal address"
			rows={3}
			bind:value={p.postalAddressAsFullText}
		/>
	</Field>

	<div class="field-grid">
		<Field label="Employer name" inputId="patient-employer">
			<TextInput id="patient-employer" label="Employer name" bind:value={p.employerName} />
		</Field>
		<Field label="Occupation" inputId="patient-occupation">
			<TextInput id="patient-occupation" label="Occupation" bind:value={p.occupation} />
		</Field>
	</div>
</Fieldset>

<style>
	.field-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}
	@media (max-width: 640px) {
		.field-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
