<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const c = assessment.data.context;
</script>

<Fieldset legend="Step 1 of 5 — Assessment context">
	<p class="hint">Who is recording the measurement, when, where, and why.</p>

	<Field label="Assessing clinician name" required inputId="context-clinicianName">
		<TextInput
			id="context-clinicianName"
			label="Assessing clinician name"
			placeholder="e.g. Dr G. Osei"
			required
			bind:value={c.clinicianName}
		/>
	</Field>

	<Field label="Clinician role" required inputId="context-clinicianRole">
		<Select id="context-clinicianRole" label="Clinician role" required bind:value={c.clinicianRole}>
			<option value="">— Select —</option>
			<option value="doctor">Doctor</option>
			<option value="nurse">Nurse</option>
			<option value="pharmacist">Pharmacist</option>
			<option value="dietitian">Dietitian</option>
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
			<option value="primary-care">Primary care</option>
			<option value="outpatient">Outpatient</option>
			<option value="inpatient">Inpatient</option>
			<option value="oncology">Oncology</option>
			<option value="pre-operative">Pre-operative</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Purpose" inputId="context-purpose">
		<Select id="context-purpose" label="Purpose" bind:value={c.purpose}>
			<option value="">— Select —</option>
			<option value="screening">Screening</option>
			<option value="drug-dosing">Drug dosing</option>
			<option value="monitoring">Monitoring</option>
			<option value="other">Other</option>
		</Select>
	</Field>
</Fieldset>
