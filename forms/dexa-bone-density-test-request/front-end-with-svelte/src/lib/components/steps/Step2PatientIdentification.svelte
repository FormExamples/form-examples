<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import { requestStore } from '$lib/stores/result.svelte';

	const d = requestStore.data;
</script>

<Fieldset legend="2. Patient Identification">
	<p class="hint">Who the DEXA scan request is for.</p>

	<Field label="NHS number" inputId="nhsNumber" required>
		<TextInput
			id="nhsNumber"
			label="NHS number"
			placeholder="e.g. 485 777 3456"
			bind:value={d.patient.nhsNumber}
			required
		/>
	</Field>

	<Field label="First name" inputId="firstName">
		<TextInput id="firstName" label="First name" bind:value={d.patient.firstName} />
	</Field>

	<Field label="Last name" inputId="lastName">
		<TextInput id="lastName" label="Last name" bind:value={d.patient.lastName} />
	</Field>

	<Field label="Date of birth" inputId="dateOfBirth">
		<DateInput id="dateOfBirth" label="Date of birth" bind:value={d.patient.dateOfBirth} />
	</Field>

	<Field
		label="Pregnancy status"
		inputId="pregnancyStatus"
		description="Known or suspected pregnancy defers the scan and drives the radiation-safety axis."
	>
		<Select id="pregnancyStatus" label="Pregnancy status" bind:value={d.patient.pregnancyStatus}>
			<option value="">Select…</option>
			<option value="not-pregnant">Not pregnant</option>
			<option value="possible">Possible</option>
			<option value="pregnant">Pregnant</option>
			<option value="not-applicable">Not applicable</option>
		</Select>
	</Field>
</Fieldset>
