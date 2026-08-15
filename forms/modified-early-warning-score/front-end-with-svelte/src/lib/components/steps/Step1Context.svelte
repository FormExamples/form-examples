<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const c = assessment.data.context;
</script>

<Fieldset legend="Step 1 of 8 — Assessment context">
	<p class="hint">Who is recording the observations, when, and where.</p>

	<Field label="Assessing clinician name" required inputId="context-clinicianName">
		<TextInput
			id="context-clinicianName"
			label="Assessing clinician name"
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

	<Field label="Date and time of observation" inputId="context-observedAt">
		<TextInput
			id="context-observedAt"
			label="Date and time of observation"
			type="datetime-local"
			class="date-input"
			bind:value={c.observedAt}
		/>
	</Field>

	<Field label="Care setting" inputId="context-careSetting">
		<Select id="context-careSetting" label="Care setting" bind:value={c.careSetting}>
			<option value="">— Select —</option>
			<option value="acute-ward">Acute ward</option>
			<option value="admissions-unit">Admissions unit</option>
			<option value="assessment-unit">Assessment unit</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Ward or location" inputId="context-wardLocation">
		<TextInput
			id="context-wardLocation"
			label="Ward or location"
			placeholder="e.g. Acute Medical Unit, Bay 3"
			bind:value={c.wardLocation}
		/>
	</Field>
</Fieldset>
