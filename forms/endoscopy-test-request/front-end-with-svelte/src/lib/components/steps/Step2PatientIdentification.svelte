<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import CheckboxGroup from '$lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '$lib/components/ui/CheckboxInput.svelte';
	import { request } from '$lib/stores/request.svelte';

	const d = request.data.patient;
</script>

<Fieldset legend="2. Patient Identification">
	<p class="hint">Patient demographics and identifiers.</p>

	<Field label="First name" inputId="firstName" required>
		<TextInput id="firstName" label="First name" bind:value={d.firstName} required />
	</Field>

	<Field label="Last name" inputId="patientLastName" required>
		<TextInput id="patientLastName" label="Last name" bind:value={d.lastName} required />
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

	<Field label="Body mass index" inputId="bodyMassIndex" description="kg/m², if known.">
		<NumberInput
			id="bodyMassIndex"
			label="Body mass index"
			min={10}
			max={80}
			step={0.1}
			bind:value={d.bodyMassIndex}
		/>
	</Field>

	<Field label="Interpreter">
		<CheckboxGroup label="Interpreter">
			<label>
				<CheckboxInput label="Interpreter required" bind:checked={d.interpreterRequired} />
				Interpreter required
			</label>
		</CheckboxGroup>
	</Field>
</Fieldset>
