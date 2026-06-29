<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import { request } from '$lib/stores/request.svelte';

	const d = request.data.patient;
</script>

<Fieldset legend="2. Patient Identification">
	<p class="hint">Patient demographics and anthropometry (height and weight drive predicted values).</p>

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

	<Field label="Height (cm)" inputId="heightCm">
		<NumberInput id="heightCm" label="Height (cm)" min={50} max={250} step={0.1} bind:value={d.heightCm} />
	</Field>

	<Field label="Weight (kg)" inputId="weightKg">
		<NumberInput id="weightKg" label="Weight (kg)" min={2} max={350} step={0.1} bind:value={d.weightKg} />
	</Field>
</Fieldset>
