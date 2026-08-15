<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';

	const p = assessment.data.patientIdentification;
</script>

<Fieldset legend="Patient Identification">
	<p class="hint">Patient details to appear on the front page of the MAT B1 certificate.</p>

	<Field label="Patient's full name" required inputId="patientName">
		<TextInput
			id="patientName"
			label="Patient's full name"
			required
			placeholder="As it should appear above Part A"
			bind:value={p.patientName}
		/>
	</Field>

	<Field label="Date of birth" inputId="patientDateOfBirth">
		<DateInput
			id="patientDateOfBirth"
			label="Date of birth"
			bind:value={p.dateOfBirth}
		/>
	</Field>

	<Field label="NHS number" inputId="nhsNumber" description="Optional, for record-keeping">
		<TextInput
			id="nhsNumber"
			label="NHS number"
			bind:value={p.nhsNumber}
		/>
	</Field>
</Fieldset>
