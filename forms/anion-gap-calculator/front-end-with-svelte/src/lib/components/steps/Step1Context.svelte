<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const c = assessment.data.context;
</script>

<Fieldset legend="Step 1 of 5 — Assessment context">
	<p class="hint">
		Who is interpreting the result, when, where, and the clinical context or indication.
	</p>

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
			<option value="scientist">Clinical scientist</option>
			<option value="pharmacist">Pharmacist</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Date and time of calculation" inputId="context-calculatedAt">
		<TextInput
			id="context-calculatedAt"
			label="Date and time of calculation"
			type="datetime-local"
			class="date-input"
			bind:value={c.calculatedAt}
		/>
	</Field>

	<Field label="Care setting" required inputId="context-careSetting">
		<Select id="context-careSetting" label="Care setting" required bind:value={c.careSetting}>
			<option value="">— Select —</option>
			<option value="emergency-department">Emergency department</option>
			<option value="ward">Ward</option>
			<option value="intensive-care">Intensive care</option>
			<option value="laboratory">Laboratory</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Clinical context / indication" inputId="context-clinicalContext">
		<TextInput
			id="context-clinicalContext"
			label="Clinical context / indication"
			placeholder="e.g. unwell diabetic, query acidosis"
			bind:value={c.clinicalContext}
		/>
	</Field>
</Fieldset>
