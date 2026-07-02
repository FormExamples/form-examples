<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const c = assessment.data.context;
</script>

<Fieldset legend="Step 1 of 6 — Assessment context">
	<p class="hint">Who is assessing the patient, when, where, and the presenting complaint.</p>

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
			<option value="doctor">Doctor</option>
			<option value="nurse">Nurse</option>
			<option value="advanced-practitioner">Advanced practitioner</option>
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
			<option value="acute-medical-unit">Acute medical unit</option>
			<option value="ward">Ward</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Presenting complaint" required inputId="context-presentingComplaint">
		<Select
			id="context-presentingComplaint"
			label="Presenting complaint"
			required
			bind:value={c.presentingComplaint}
		>
			<option value="">— Select —</option>
			<option value="haematemesis">Haematemesis</option>
			<option value="coffee-ground">Coffee-ground vomiting</option>
			<option value="melaena">Melaena</option>
			<option value="other">Other</option>
		</Select>
	</Field>
</Fieldset>
