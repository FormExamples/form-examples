<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import { resultStore } from '#lib/stores/result.svelte.js';

	const d = resultStore.data;
</script>

<Fieldset legend="2. Patient Identification">
	<p class="hint">Identify the patient this response relates to.</p>

	<Field label="Patient name" inputId="patientName" required>
		<TextInput
			id="patientName"
			label="Patient name"
			placeholder="e.g. Jane Smith"
			bind:value={d.patientName}
			required
		/>
	</Field>

	<Field
		label="NHS number"
		inputId="patientNhsNumber"
		description="The patient's 10-digit NHS number."
	>
		<TextInput
			id="patientNhsNumber"
			label="NHS number"
			placeholder="e.g. 943 476 5919"
			bind:value={d.patientNhsNumber}
		/>
	</Field>

	<Field label="Date of birth" inputId="patientBirthDate">
		<DateInput id="patientBirthDate" label="Date of birth" bind:value={d.patientBirthDate} />
	</Field>
</Fieldset>
