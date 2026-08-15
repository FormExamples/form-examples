<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const a = assessment.data.alternativeTreatments;
</script>

<Fieldset legend="Alternative Treatments">
	<p class="hint">Document alternative options and consequences of no treatment.</p>

	<Field label="Alternative Treatment Options" inputId="alternativeOptions">
		<TextAreaInput
			id="alternativeOptions"
			label="Alternative Treatment Options"
			rows={4}
			placeholder="Describe alternative treatments available..."
			bind:value={a.alternativeOptions}
		/>
	</Field>

	<Field label="Consequences of No Treatment" inputId="noTreatmentConsequences">
		<TextAreaInput
			id="noTreatmentConsequences"
			label="Consequences of No Treatment"
			rows={4}
			placeholder="Describe what may happen if the patient chooses not to proceed with treatment..."
			bind:value={a.noTreatmentConsequences}
		/>
	</Field>

	<Field label="Patient Preference" inputId="patientPreference">
		<TextAreaInput
			id="patientPreference"
			label="Patient Preference"
			rows={3}
			placeholder="Record the patient's stated preference regarding treatment options..."
			bind:value={a.patientPreference}
		/>
	</Field>
</Fieldset>
