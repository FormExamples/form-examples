<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const c = assessment.data.context;
</script>

<Fieldset legend="Step 1 of 7 — Assessment context">
	<p class="hint">Who is recording the observations, and when and where.</p>

	<Field label="Recording clinician name" required inputId="context-clinicianName">
		<TextInput
			id="context-clinicianName"
			label="Recording clinician name"
			placeholder="e.g. Nurse J. Okafor"
			required
			bind:value={c.clinicianName}
		/>
	</Field>

	<Field label="Clinician role" required inputId="context-clinicianRole">
		<Select id="context-clinicianRole" label="Clinician role" required bind:value={c.clinicianRole}>
			<option value="">— Select —</option>
			<option value="nurse">Nurse</option>
			<option value="healthcare-assistant">Healthcare assistant</option>
			<option value="doctor">Doctor</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Date and time of observation" inputId="context-observationAt">
		<TextInput
			id="context-observationAt"
			label="Date and time of observation"
			type="datetime-local"
			class="date-input"
			bind:value={c.observationAt}
		/>
	</Field>

	<Field label="Care setting" inputId="context-careSetting">
		<Select id="context-careSetting" label="Care setting" bind:value={c.careSetting}>
			<option value="">— Select —</option>
			<option value="ward">Paediatric ward</option>
			<option value="childrens-assessment-unit">Children's assessment unit</option>
			<option value="emergency-department">Emergency department</option>
			<option value="other">Other</option>
		</Select>
	</Field>
</Fieldset>
