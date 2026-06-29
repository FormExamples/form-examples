<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import { request } from '$lib/stores/request.svelte';

	const p = request.data.patient;
</script>

<Fieldset legend="2. Patient Identification">
	<p class="hint">Identify the patient the monitoring is requested for.</p>

	<Field label="First name" inputId="firstName">
		<TextInput id="firstName" label="First name" bind:value={p.firstName} />
	</Field>

	<Field label="Last name" inputId="lastName">
		<TextInput id="lastName" label="Last name" bind:value={p.lastName} />
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

	<Field label="Date of birth" inputId="dateOfBirth">
		<DateInput id="dateOfBirth" label="Date of birth" bind:value={p.dateOfBirth} />
	</Field>

	<Field label="Body mass index" inputId="bodyMassIndex" description="kg/m², if known.">
		<NumberInput
			id="bodyMassIndex"
			label="Body mass index"
			min={10}
			max={80}
			step={0.1}
			bind:value={p.bodyMassIndex}
		/>
	</Field>
</Fieldset>
