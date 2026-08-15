<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const c = assessment.data.context;
</script>

<Fieldset legend="Step 1 of 6 — Assessment context">
	<p class="hint">Who is assessing, when, in which setting, and the presenting complaint.</p>

	<Field label="Clinician name" required inputId="context-clinicianName">
		<TextInput
			id="context-clinicianName"
			label="Clinician name"
			placeholder="e.g. Dr A. Fenwick"
			required
			bind:value={c.clinicianName}
		/>
	</Field>

	<Field label="Clinician role" required inputId="context-clinicianRole">
		<Select id="context-clinicianRole" label="Clinician role" required bind:value={c.clinicianRole}>
			<option value="">— Select —</option>
			<option value="physician">Physician</option>
			<option value="advanced-practitioner">Advanced practitioner</option>
			<option value="nurse">Nurse</option>
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

	<Field
		label="Care setting"
		description="PERC is intended for emergency and acute ambulatory settings."
		inputId="context-careSetting"
	>
		<Select id="context-careSetting" label="Care setting" bind:value={c.careSetting}>
			<option value="">— Select —</option>
			<option value="emergency-department">Emergency department</option>
			<option value="acute-ambulatory">Acute ambulatory care</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Presenting complaint" inputId="context-presentingComplaint">
		<TextAreaInput
			id="context-presentingComplaint"
			label="Presenting complaint"
			rows={3}
			placeholder="e.g. pleuritic chest pain, dyspnoea; note the clinical context."
			bind:value={c.presentingComplaint}
		/>
	</Field>
</Fieldset>
