<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import CheckboxGroup from '#lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '#lib/components/ui/CheckboxInput.svelte';
	import { request } from '#lib/stores/request.svelte.js';

	const p = request.data.patient;
</script>

<Fieldset legend="2. Patient Identification">
	<p class="hint">Patient demographics and access needs.</p>

	<Field label="First name" inputId="firstName" required>
		<TextInput id="firstName" label="First name" bind:value={p.firstName} required />
	</Field>

	<Field label="Last name" inputId="lastName" required>
		<TextInput id="lastName" label="Last name" bind:value={p.lastName} required />
	</Field>

	<Field label="Date of birth" inputId="dateOfBirth">
		<DateInput id="dateOfBirth" label="Date of birth" bind:value={p.dateOfBirth} />
	</Field>

	<Field label="NHS number" inputId="nhsNumber" description="In the NNN NNN NNNN display form.">
		<TextInput id="nhsNumber" label="NHS number" placeholder="NNN NNN NNNN" bind:value={p.nhsNumber} />
	</Field>

	<Field label="Access needs">
		<CheckboxGroup label="Access needs">
			<label><CheckboxInput label="Interpreter required" bind:checked={p.interpreterRequired} /> Interpreter required</label>
		</CheckboxGroup>
	</Field>
</Fieldset>
