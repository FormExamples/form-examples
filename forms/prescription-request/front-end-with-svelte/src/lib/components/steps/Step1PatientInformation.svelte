<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';

	const p = assessment.data.patientInformation;
</script>

<Fieldset legend="Patient Information">
	<p class="hint">Details of the patient requesting the prescription.</p>

	<div class="field-grid">
		<Field label="First Name" required inputId="patientFirstName">
			<TextInput id="patientFirstName" label="First Name" required bind:value={p.firstName} />
		</Field>
		<Field label="Last Name" required inputId="patientLastName">
			<TextInput id="patientLastName" label="Last Name" required bind:value={p.lastName} />
		</Field>
	</div>

	<Field label="NHS Patient Number" inputId="nhsNumber">
		<TextInput id="nhsNumber" label="NHS Patient Number" placeholder="e.g. 943 476 5919" bind:value={p.nhsNumber} />
	</Field>

	<div class="field-grid">
		<Field label="Phone" required inputId="patientPhone">
			<TextInput id="patientPhone" label="Phone" bind:value={p.phone} required />
		</Field>
		<Field label="Email" inputId="patientEmail">
			<TextInput id="patientEmail" label="Email" type="email" bind:value={p.email} />
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
