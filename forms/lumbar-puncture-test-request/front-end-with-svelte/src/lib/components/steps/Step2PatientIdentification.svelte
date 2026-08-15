<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import { request } from '#lib/stores/request.svelte.js';

	const p = request.data.patient;
</script>

<Fieldset legend="2. Patient Identification">
	<p class="hint">Identify the patient the lumbar puncture is requested for.</p>

	<Field label="First name" inputId="firstName" required>
		<TextInput id="firstName" label="First name" bind:value={p.firstName} required />
	</Field>

	<Field label="Last name" inputId="lastName" required>
		<TextInput id="lastName" label="Last name" bind:value={p.lastName} required />
	</Field>

	<Field label="Date of birth" inputId="dateOfBirth">
		<DateInput id="dateOfBirth" label="Date of birth" bind:value={p.dateOfBirth} />
	</Field>

	<Field label="NHS number" inputId="nhsNumber" required>
		<TextInput
			id="nhsNumber"
			label="NHS number"
			placeholder="e.g. 485 777 3456"
			bind:value={p.nhsNumber}
			required
		/>
	</Field>
</Fieldset>
