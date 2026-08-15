<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import CheckboxInput from '#lib/components/ui/CheckboxInput.svelte';
	import { request } from '#lib/stores/request.svelte.js';

	const d = request.data;
</script>

<Fieldset legend="2. Patient Identification">
	<p class="hint">Patient demographics and access needs.</p>

	<Field label="First name" inputId="firstName" required>
		<TextInput id="firstName" label="First name" bind:value={d.patient.firstName} required />
	</Field>

	<Field label="Last name" inputId="lastName" required>
		<TextInput id="lastName" label="Last name" bind:value={d.patient.lastName} required />
	</Field>

	<Field label="Date of birth" inputId="dateOfBirth">
		<DateInput id="dateOfBirth" label="Date of birth" bind:value={d.patient.dateOfBirth} />
	</Field>

	<Field label="NHS number" inputId="nhsNumber" required>
		<TextInput id="nhsNumber" label="NHS number" placeholder="NNN NNN NNNN" bind:value={d.patient.nhsNumber} required />
	</Field>

	<Field label="Body mass index" inputId="bodyMassIndex" description="kg/m² — used for a body-habitus suitability caveat.">
		<NumberInput id="bodyMassIndex" label="Body mass index" min={10} max={80} step={0.1} bind:value={d.patient.bodyMassIndex} />
	</Field>

	<Field label="Access needs">
		<label><CheckboxInput label="Interpreter required" bind:checked={d.patient.interpreterRequired} /> Interpreter required</label>
	</Field>
</Fieldset>
