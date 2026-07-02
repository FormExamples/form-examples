<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const c = assessment.data.context;
</script>

<Fieldset legend="Step 1 of 7 — Assessment context">
	<p class="hint">Who is assessing, when, where, and the working diagnosis.</p>

	<Field label="Assessing clinician name" required inputId="context-clinicianName">
		<TextInput
			id="context-clinicianName"
			label="Assessing clinician name"
			placeholder="e.g. Dr A. Khan"
			required
			bind:value={c.clinicianName}
		/>
	</Field>

	<Field label="Clinician role" required inputId="context-clinicianRole">
		<Select id="context-clinicianRole" label="Clinician role" required bind:value={c.clinicianRole}>
			<option value="">— Select —</option>
			<option value="physician">Physician</option>
			<option value="cardiologist">Cardiologist</option>
			<option value="nurse-practitioner">Nurse practitioner</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Date and time of assessment" inputId="context-assessedAt">
		<TextInput
			id="context-assessedAt"
			label="Date and time of assessment"
			type="datetime-local"
			class="date-input"
			bind:value={c.assessedAt}
		/>
	</Field>

	<Field label="Care setting" required inputId="context-careSetting">
		<Select id="context-careSetting" label="Care setting" required bind:value={c.careSetting}>
			<option value="">— Select —</option>
			<option value="emergency-department">Emergency department</option>
			<option value="chest-pain-unit">Chest-pain unit</option>
			<option value="ward">General / acute ward</option>
			<option value="coronary-care">Coronary-care unit</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field
		label="Working diagnosis"
		description="This score is for unstable angina or NSTEMI only — not for STEMI."
		inputId="context-workingDiagnosis"
	>
		<Select
			id="context-workingDiagnosis"
			label="Working diagnosis"
			bind:value={c.workingDiagnosis}
		>
			<option value="">— Select —</option>
			<option value="unstable-angina">Unstable angina</option>
			<option value="nstemi">NSTEMI</option>
		</Select>
	</Field>
</Fieldset>
