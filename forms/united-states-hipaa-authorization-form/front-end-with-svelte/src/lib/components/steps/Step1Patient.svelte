<script lang="ts">
	import { authorization } from '$lib/stores/authorization.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';

	const d = authorization.data.patient;
</script>

<Fieldset legend="Patient identification">
	<p class="hint">Identify the individual whose Protected Health Information (PHI) may be disclosed.</p>

	<Field label="Print name" required inputId="patient-name">
		<TextInput id="patient-name" label="Print name" required bind:value={d.name} />
	</Field>

	<Field label="Date of birth" required inputId="patient-birthDate">
		<DateInput id="patient-birthDate" label="Date of birth" required bind:value={d.birthDate} />
	</Field>

	<Field label="Social Security Number (optional)" inputId="patient-ssn">
		<TextInput id="patient-ssn" label="Social Security Number" placeholder="123-45-6789" bind:value={d.socialSecurityNumber} />
	</Field>

	<Field label="Street address" required inputId="patient-streetAddress">
		<TextInput id="patient-streetAddress" label="Street address" required bind:value={d.streetAddress} />
	</Field>

	<Field label="City" required inputId="patient-city">
		<TextInput id="patient-city" label="City" required bind:value={d.city} />
	</Field>

	<Field label="State" required inputId="patient-state">
		<TextInput id="patient-state" label="State" maxlength="2" required bind:value={d.state} />
	</Field>

	<Field label="ZIP" required inputId="patient-zipCode">
		<TextInput id="patient-zipCode" label="ZIP" required bind:value={d.zipCode} />
	</Field>

	<Field label="Phone" required inputId="patient-phone">
		<TextInput id="patient-phone" label="Phone" required bind:value={d.phone} />
	</Field>

	<Field label="Email" inputId="patient-email">
		<TextInput id="patient-email" label="Email" bind:value={d.email} />
	</Field>
</Fieldset>
