<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const c = assessment.data.context;
</script>

<Fieldset legend="Step 1 of 10 — Assessment context">
	<p class="hint">Who is assessing, when, in what care setting, and why.</p>

	<Field label="Assessing clinician name" required inputId="context-clinicianName">
		<TextInput
			id="context-clinicianName"
			label="Assessing clinician name"
			placeholder="e.g. Dr A. Okafor"
			required
			bind:value={c.clinicianName}
		/>
	</Field>

	<Field label="Clinician role" required inputId="context-clinicianRole">
		<Select id="context-clinicianRole" label="Clinician role" required bind:value={c.clinicianRole}>
			<option value="">— Select —</option>
			<option value="psychiatrist">Psychiatrist</option>
			<option value="mental-health-nurse">Mental-health nurse</option>
			<option value="gp">General practitioner</option>
			<option value="liaison">Liaison-psychiatry clinician</option>
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
			<option value="outpatient">Outpatient clinic</option>
			<option value="inpatient">Inpatient ward</option>
			<option value="liaison">Liaison psychiatry</option>
			<option value="crisis">Crisis / home treatment</option>
			<option value="primary-care">Primary care</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Reason for assessment / referral" inputId="context-assessmentReason">
		<TextAreaInput
			id="context-assessmentReason"
			label="Reason for assessment / referral"
			rows={2}
			placeholder="Brief reason for this mental state examination."
			bind:value={c.assessmentReason}
		/>
	</Field>
</Fieldset>
