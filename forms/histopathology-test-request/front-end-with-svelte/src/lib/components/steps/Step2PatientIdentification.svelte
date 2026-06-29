<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import CheckboxInput from '$lib/components/ui/CheckboxInput.svelte';
	import { request } from '$lib/stores/result.svelte';

	const d = request.data.patient;
</script>

<Fieldset legend="2. Patient Identification">
	<p class="hint">The patient the tissue specimen was taken from.</p>

	<Field label="First name" inputId="firstName">
		<TextInput id="firstName" label="First name" bind:value={d.firstName} />
	</Field>

	<Field label="Last name" inputId="lastName">
		<TextInput id="lastName" label="Last name" bind:value={d.lastName} />
	</Field>

	<Field label="Date of birth" inputId="dateOfBirth">
		<DateInput id="dateOfBirth" label="Date of birth" bind:value={d.dateOfBirth} />
	</Field>

	<Field label="NHS number" inputId="nhsNumber" required>
		<TextInput
			id="nhsNumber"
			label="NHS number"
			placeholder="e.g. 485 777 3456"
			bind:value={d.nhsNumber}
			required
		/>
	</Field>

	<Field label="Interpreter required" inputId="interpreterRequired">
		<CheckboxInput
			id="interpreterRequired"
			label="Interpreter required"
			bind:checked={d.interpreterRequired}
		/>
	</Field>
</Fieldset>
