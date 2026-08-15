<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const c = assessment.data.context;
</script>

<Fieldset legend="Step 1 of 8 — Assessment context">
	<p class="hint">Who is assessing, when, where, and the reason for the observation.</p>

	<Field label="Assessing observer name" required inputId="context-assessorName">
		<TextInput
			id="context-assessorName"
			label="Assessing observer name"
			placeholder="e.g. Dr A. Osei"
			required
			bind:value={c.assessorName}
		/>
	</Field>

	<Field label="Observer role" required inputId="context-assessorRole">
		<Select id="context-assessorRole" label="Observer role" required bind:value={c.assessorRole}>
			<option value="">— Select —</option>
			<option value="doctor">Doctor</option>
			<option value="nurse">Nurse</option>
			<option value="paramedic">Paramedic</option>
			<option value="emergency-medical-technician">Emergency medical technician</option>
			<option value="advanced-clinical-practitioner">Advanced clinical practitioner</option>
			<option value="neuro-observation-staff">Neuro-observation staff</option>
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

	<Field label="Care setting" required inputId="context-setting">
		<Select id="context-setting" label="Care setting" required bind:value={c.setting}>
			<option value="">— Select —</option>
			<option value="ed">Emergency department</option>
			<option value="neuro">Neuro / neurosurgical unit</option>
			<option value="critical-care">Critical care / HDU</option>
			<option value="pre-hospital">Pre-hospital / ambulance</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Reason for assessment" inputId="context-reason">
		<TextInput
			id="context-reason"
			label="Reason for assessment"
			placeholder="e.g. Head injury observation, post-arrest, altered consciousness"
			bind:value={c.reason}
		/>
	</Field>
</Fieldset>
