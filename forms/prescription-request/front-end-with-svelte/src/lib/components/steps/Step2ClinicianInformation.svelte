<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';

	const c = assessment.data.clinicianInformation;
</script>

<Fieldset legend="Clinician Information">
	<p class="hint">Details of the prescribing clinician.</p>

	<div class="field-grid">
		<Field label="First Name" required inputId="clinicianFirstName">
			<TextInput id="clinicianFirstName" label="First Name" required bind:value={c.firstName} />
		</Field>
		<Field label="Last Name" required inputId="clinicianLastName">
			<TextInput id="clinicianLastName" label="Last Name" required bind:value={c.lastName} />
		</Field>
	</div>

	<Field label="NHS Employee Number" inputId="nhsEmployeeNumber">
		<TextInput id="nhsEmployeeNumber" label="NHS Employee Number" placeholder="e.g. C1234567" bind:value={c.nhsEmployeeNumber} />
	</Field>

	<div class="field-grid">
		<Field label="Phone" required inputId="clinicianPhone">
			<TextInput id="clinicianPhone" label="Phone" bind:value={c.phone} required />
		</Field>
		<Field label="Email" inputId="clinicianEmail">
			<TextInput id="clinicianEmail" label="Email" type="email" bind:value={c.email} />
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
