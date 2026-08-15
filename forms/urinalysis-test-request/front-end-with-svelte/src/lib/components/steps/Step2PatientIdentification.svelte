<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import { requestStore } from '#lib/stores/request.svelte.js';

	const d = requestStore.data.patient;
</script>

<Fieldset legend="2. Patient Identification">
	<p class="hint">Patient demographics.</p>

	<Field label="First name" inputId="firstName" required>
		<TextInput id="firstName" label="First name" bind:value={d.firstName} required />
	</Field>

	<Field label="Last name" inputId="lastName" required>
		<TextInput id="lastName" label="Last name" bind:value={d.lastName} required />
	</Field>

	<Field label="Date of birth" inputId="dateOfBirth">
		<DateInput id="dateOfBirth" label="Date of birth" bind:value={d.dateOfBirth} />
	</Field>

	<Field label="NHS number" inputId="nhsNumber">
		<TextInput id="nhsNumber" label="NHS number" placeholder="NNN NNN NNNN" bind:value={d.nhsNumber} />
	</Field>
</Fieldset>
