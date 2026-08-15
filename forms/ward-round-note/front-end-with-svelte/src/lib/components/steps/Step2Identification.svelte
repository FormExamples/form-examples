<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const i = assessment.data.identification;
</script>

<Fieldset legend="Step 2 of 11 — Patient identification">
	<p class="hint">Local identifier, admission date, and the reason for admission.</p>

	<Field label="Patient identifier" required inputId="identification-patientIdentifier">
		<TextInput
			id="identification-patientIdentifier"
			label="Patient identifier"
			placeholder="e.g. hospital MRN or local identifier"
			required
			bind:value={i.patientIdentifier}
		/>
	</Field>

	<Field label="Admission date" inputId="identification-admissionDate">
		<TextInput
			id="identification-admissionDate"
			label="Admission date"
			type="date"
			class="date-input"
			bind:value={i.admissionDate}
		/>
	</Field>

	<Field label="Primary diagnosis / reason for admission" inputId="identification-primaryDiagnosis">
		<TextAreaInput
			id="identification-primaryDiagnosis"
			label="Primary diagnosis / reason for admission"
			rows={2}
			placeholder="Working diagnosis or reason for admission."
			bind:value={i.primaryDiagnosis}
		/>
	</Field>
</Fieldset>
