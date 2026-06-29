<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import CheckboxGroup from '$lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '$lib/components/ui/CheckboxInput.svelte';
	import { request } from '$lib/stores/request.svelte';

	const d = request.data.patient;
</script>

<Fieldset legend="2. Patient Identification">
	<p class="hint">Who the EEG request is for.</p>

	<Field label="NHS number" inputId="nhsNumber" required>
		<TextInput
			id="nhsNumber"
			label="NHS number"
			placeholder="e.g. 485 777 3456"
			bind:value={d.nhsNumber}
			required
		/>
	</Field>

	<Field label="First name" inputId="firstName">
		<TextInput id="firstName" label="First name" placeholder="First name" bind:value={d.firstName} />
	</Field>

	<Field label="Last name" inputId="lastName">
		<TextInput id="lastName" label="Last name" placeholder="Last name" bind:value={d.lastName} />
	</Field>

	<Field label="Date of birth" inputId="dateOfBirth">
		<DateInput id="dateOfBirth" label="Date of birth" bind:value={d.dateOfBirth} />
	</Field>

	<Field label="Interpreter required">
		<CheckboxGroup label="Interpreter required">
			<label
				><CheckboxInput label="Interpreter required" bind:checked={d.interpreterRequired} /> Interpreter
				required</label
			>
		</CheckboxGroup>
	</Field>
</Fieldset>
