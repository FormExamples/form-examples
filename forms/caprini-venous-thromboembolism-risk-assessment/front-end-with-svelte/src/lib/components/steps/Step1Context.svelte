<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const c = assessment.data.context;
</script>

<Fieldset legend="Step 1 of 8 — Assessment context">
	<p class="hint">Who is assessing, when, where, and the admission type.</p>

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
			<option value="surgeon">Surgeon</option>
			<option value="nurse">Nurse</option>
			<option value="pharmacist">Pharmacist</option>
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
			<option value="surgical-ward">Surgical ward</option>
			<option value="medical-ward">Medical ward</option>
			<option value="pre-operative-clinic">Pre-operative clinic</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Admission type" inputId="context-admissionType">
		<Select id="context-admissionType" label="Admission type" bind:value={c.admissionType}>
			<option value="">— Select —</option>
			<option value="surgical">Surgical</option>
			<option value="medical">Medical</option>
		</Select>
	</Field>
</Fieldset>
