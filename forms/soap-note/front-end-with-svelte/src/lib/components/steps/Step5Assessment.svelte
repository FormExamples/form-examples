<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const a = assessment.data.assessment;
</script>

<Fieldset legend="Step 5 of 7 — Assessment (A)">
	<p class="hint">
		The clinician's interpretation. At least one recorded problem, diagnosis, or differential is
		required — a missing Assessment makes the note incomplete.
	</p>

	<Field label="Primary diagnosis or problem" inputId="assessment-primaryDiagnosis">
		<TextAreaInput
			id="assessment-primaryDiagnosis"
			label="Primary diagnosis or problem"
			rows={2}
			placeholder="e.g. Likely acute coronary syndrome — for urgent assessment."
			bind:value={a.primaryDiagnosis}
		/>
	</Field>

	<Field label="Problem list" inputId="assessment-problemList">
		<TextAreaInput
			id="assessment-problemList"
			label="Problem list"
			rows={2}
			placeholder="Active problems relevant to this encounter."
			bind:value={a.problemList}
		/>
	</Field>

	<Field label="Differential diagnoses" inputId="assessment-differential">
		<TextAreaInput
			id="assessment-differential"
			label="Differential diagnoses"
			rows={2}
			placeholder="Alternatives considered."
			bind:value={a.differential}
		/>
	</Field>

	<Field label="Clinical impression" inputId="assessment-clinicalImpression">
		<TextAreaInput
			id="assessment-clinicalImpression"
			label="Clinical impression"
			rows={2}
			placeholder="Overall clinical impression."
			bind:value={a.clinicalImpression}
		/>
	</Field>
</Fieldset>
