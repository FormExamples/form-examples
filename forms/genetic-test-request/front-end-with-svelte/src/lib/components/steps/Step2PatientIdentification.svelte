<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import { request } from '$lib/stores/request.svelte';

	const d = request.data;
</script>

<Fieldset legend="2. Patient Identification">
	<p class="hint">Who the test is for. The proband or at-risk relative.</p>

	<Field label="NHS number" inputId="nhsNumber" required>
		<TextInput
			id="nhsNumber"
			label="NHS number"
			placeholder="e.g. 485 777 3456"
			bind:value={d.patient.nhsNumber}
			required
		/>
	</Field>

	<Field label="First name" inputId="firstName">
		<TextInput
			id="firstName"
			label="First name"
			placeholder="First name"
			bind:value={d.patient.firstName}
		/>
	</Field>

	<Field label="Last name" inputId="lastName">
		<TextInput
			id="lastName"
			label="Last name"
			placeholder="Last name"
			bind:value={d.patient.lastName}
		/>
	</Field>

	<Field label="Date of birth" inputId="dateOfBirth">
		<DateInput id="dateOfBirth" label="Date of birth" bind:value={d.patient.dateOfBirth} />
	</Field>

	<Field label="Address" inputId="addressLine">
		<TextInput
			id="addressLine"
			label="Address"
			placeholder="Address line"
			bind:value={d.patient.addressLine}
		/>
	</Field>
</Fieldset>
