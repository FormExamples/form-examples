<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import { request } from '$lib/stores/request.svelte';

	const d = request.data.patient;
</script>

<Fieldset legend="2. Patient Identification">
	<p class="hint">The patient the echocardiogram is requested for.</p>

	<Field label="First name" inputId="firstName">
		<TextInput id="firstName" label="First name" placeholder="e.g. Margaret" bind:value={d.firstName} />
	</Field>

	<Field label="Last name" inputId="lastName">
		<TextInput id="lastName" label="Last name" placeholder="e.g. Hughes" bind:value={d.lastName} />
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

	<Field label="Date of birth" inputId="dateOfBirth">
		<DateInput id="dateOfBirth" label="Date of birth" bind:value={d.dateOfBirth} />
	</Field>

	<Field label="Height (cm)" inputId="heightAsCm">
		<NumberInput id="heightAsCm" label="Height (cm)" min={0} max={300} bind:value={d.heightAsCm} />
	</Field>

	<Field label="Weight (kg)" inputId="weightAsKg">
		<NumberInput id="weightAsKg" label="Weight (kg)" min={0} max={500} bind:value={d.weightAsKg} />
	</Field>

	<Field label="Body mass index" inputId="bodyMassIndex" description="kg/m², if known.">
		<NumberInput
			id="bodyMassIndex"
			label="Body mass index"
			min={0}
			max={100}
			step="0.1"
			bind:value={d.bodyMassIndex}
		/>
	</Field>
</Fieldset>
