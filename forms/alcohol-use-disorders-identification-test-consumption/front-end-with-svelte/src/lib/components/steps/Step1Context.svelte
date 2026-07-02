<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const c = assessment.data.context;
</script>

<Fieldset legend="Step 1 of 6 — Assessment context">
	<p class="hint">Who is assessing, when, where, and how the AUDIT-C was administered.</p>

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
			<option value="gp">General practitioner</option>
			<option value="nurse">Nurse</option>
			<option value="healthcare-assistant">Healthcare assistant</option>
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
			<option value="primary-care">Primary care / general practice</option>
			<option value="emergency-department">Emergency department</option>
			<option value="health-check">NHS Health Check / health promotion</option>
			<option value="inpatient">Inpatient / hospital admission</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Administration mode" inputId="context-administrationMode">
		<Select
			id="context-administrationMode"
			label="Administration mode"
			bind:value={c.administrationMode}
		>
			<option value="">— Select —</option>
			<option value="self-completed">Self-completed by the patient</option>
			<option value="interview">Clinician interview</option>
		</Select>
	</Field>
</Fieldset>
