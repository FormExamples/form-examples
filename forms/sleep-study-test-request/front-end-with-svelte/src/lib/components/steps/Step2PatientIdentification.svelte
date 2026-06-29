<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import CheckboxGroup from '$lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '$lib/components/ui/CheckboxInput.svelte';
	import { request } from '$lib/stores/request.svelte';

	const p = request.data.patient;
</script>

<Fieldset legend="2. Patient Identification">
	<p class="hint">Patient demographics, NHS number, anthropometry, and access needs.</p>

	<Field label="First name" inputId="firstName" required>
		<TextInput id="firstName" label="First name" bind:value={p.firstName} required />
	</Field>

	<Field label="Last name" inputId="lastName" required>
		<TextInput id="lastName" label="Last name" bind:value={p.lastName} required />
	</Field>

	<Field label="Date of birth" inputId="dateOfBirth">
		<DateInput id="dateOfBirth" label="Date of birth" bind:value={p.dateOfBirth} />
	</Field>

	<Field label="NHS number" inputId="nhsNumber">
		<TextInput id="nhsNumber" label="NHS number" placeholder="NNN NNN NNNN" bind:value={p.nhsNumber} />
	</Field>

	<Field label="Body mass index" inputId="bodyMassIndex" description="kg/m²">
		<NumberInput
			id="bodyMassIndex"
			label="Body mass index"
			min={10}
			max={80}
			step={0.1}
			bind:value={p.bodyMassIndex}
		/>
	</Field>

	<Field label="Access needs">
		<CheckboxGroup label="Access needs">
			<label>
				<CheckboxInput label="Interpreter required" bind:checked={p.interpreterRequired} /> Interpreter required
			</label>
		</CheckboxGroup>
	</Field>
</Fieldset>
