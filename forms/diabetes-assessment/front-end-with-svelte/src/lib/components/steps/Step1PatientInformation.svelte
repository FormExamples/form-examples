<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import TelInput from '$lib/components/ui/TelInput.svelte';
	import EmailInput from '$lib/components/ui/EmailInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const d = assessment.data.patientInformation;
</script>

<Fieldset legend="Patient Information">
	<p class="hint">Please provide the patient's demographic and contact details.</p>

	<div class="field-grid">
		<Field label="Full Name" inputId="fullName">
			<TextInput id="fullName" label="Full Name" placeholder="e.g. John Smith" bind:value={d.fullName} />
		</Field>
		<Field label="Date of Birth" inputId="dateOfBirth">
			<DateInput id="dateOfBirth" label="Date of Birth" bind:value={d.dateOfBirth} />
		</Field>
	</div>

	<div class="field-grid">
		<Field label="NHS Number" inputId="nhsNumber">
			<TextInput id="nhsNumber" label="NHS Number" placeholder="e.g. 123 456 7890" bind:value={d.nhsNumber} />
		</Field>
		<Field label="Telephone" inputId="telephone">
			<TelInput id="telephone" label="Telephone" placeholder="e.g. 07700 900000" bind:value={d.telephone} />
		</Field>
	</div>

	<Field label="Address" inputId="address">
		<TextAreaInput id="address" label="Address" rows={2} placeholder="Full postal address" bind:value={d.address} />
	</Field>

	<Field label="Email" inputId="email">
		<EmailInput id="email" label="Email" placeholder="e.g. patient@example.com" bind:value={d.email} />
	</Field>

	<div class="field-grid">
		<Field label="GP Name" inputId="gpName">
			<TextInput id="gpName" label="GP Name" placeholder="e.g. Dr Jones" bind:value={d.gpName} />
		</Field>
		<Field label="GP Practice" inputId="gpPractice">
			<TextInput id="gpPractice" label="GP Practice" placeholder="e.g. Riverside Surgery" bind:value={d.gpPractice} />
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
