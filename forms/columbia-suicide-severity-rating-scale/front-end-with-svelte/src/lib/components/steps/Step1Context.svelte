<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const c = assessment.data.context;
</script>

<Fieldset legend="Step 1 of 8 — Assessment context">
	<p class="hint">Who is assessing, when, where, and which C-SSRS version is being used.</p>

	<Field label="Assessing clinician name" required inputId="context-clinicianName">
		<TextInput
			id="context-clinicianName"
			label="Assessing clinician name"
			placeholder="e.g. Dr A. Osei"
			required
			bind:value={c.clinicianName}
		/>
	</Field>

	<Field label="Clinician role" required inputId="context-clinicianRole">
		<Select id="context-clinicianRole" label="Clinician role" required bind:value={c.clinicianRole}>
			<option value="">— Select —</option>
			<option value="clinician">Clinician</option>
			<option value="nurse">Nurse</option>
			<option value="mental-health-practitioner">Mental-health practitioner</option>
			<option value="crisis-worker">Crisis worker</option>
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
			<option value="mental-health">Mental-health service</option>
			<option value="emergency-department">Emergency department</option>
			<option value="primary-care">Primary care</option>
			<option value="crisis-service">Crisis service</option>
			<option value="inpatient">Inpatient ward</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field
		label="C-SSRS version"
		description="The screener (triage) version is a short yes/no set; the full version adds ideation-intensity sub-items and detailed behaviour and lethality coding."
		required
		inputId="context-scaleVersion"
	>
		<Select id="context-scaleVersion" label="C-SSRS version" required bind:value={c.scaleVersion}>
			<option value="">— Select —</option>
			<option value="screener">Screener (triage)</option>
			<option value="full">Full version</option>
		</Select>
	</Field>

	<Field label="Reason for assessment" inputId="context-reasonForAssessment">
		<TextAreaInput
			id="context-reasonForAssessment"
			label="Reason for assessment"
			rows={2}
			placeholder="What triggered this screen?"
			bind:value={c.reasonForAssessment}
		/>
	</Field>
</Fieldset>
