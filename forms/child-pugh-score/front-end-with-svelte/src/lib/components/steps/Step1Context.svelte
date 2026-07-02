<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const c = assessment.data.context;
</script>

<Fieldset legend="Step 1 of 8 — Assessment context">
	<p class="hint">Who is assessing the patient, when, where, and the aetiology of the liver disease.</p>

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
			<option value="hepatologist">Hepatologist</option>
			<option value="surgeon">Surgeon</option>
			<option value="anaesthetist">Anaesthetist</option>
			<option value="physician">Physician</option>
			<option value="nurse">Specialist nurse</option>
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
			<option value="hepatology-clinic">Hepatology / gastroenterology clinic</option>
			<option value="ward">General / acute ward</option>
			<option value="pre-operative">Pre-operative assessment</option>
			<option value="intensive-care">Intensive care</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Aetiology of liver disease" inputId="context-aetiology">
		<Select id="context-aetiology" label="Aetiology of liver disease" bind:value={c.aetiology}>
			<option value="">— Select —</option>
			<option value="alcohol">Alcohol-related</option>
			<option value="viral-hepatitis">Viral hepatitis</option>
			<option value="nafld">NAFLD / MASLD</option>
			<option value="autoimmune">Autoimmune</option>
			<option value="cholestatic">Cholestatic</option>
			<option value="other">Other</option>
		</Select>
	</Field>
</Fieldset>
