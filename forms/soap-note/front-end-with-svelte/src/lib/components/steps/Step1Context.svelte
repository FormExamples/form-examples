<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const c = assessment.data.context;
</script>

<Fieldset legend="Step 1 of 7 — Encounter context">
	<p class="hint">Who is documenting, when, where, and the type of encounter.</p>

	<Field label="Authoring clinician name" required inputId="context-clinicianName">
		<TextInput
			id="context-clinicianName"
			label="Authoring clinician name"
			placeholder="e.g. Dr A. Okafor"
			required
			bind:value={c.clinicianName}
		/>
	</Field>

	<Field label="Clinician role" required inputId="context-clinicianRole">
		<Select id="context-clinicianRole" label="Clinician role" required bind:value={c.clinicianRole}>
			<option value="">— Select —</option>
			<option value="doctor">Doctor</option>
			<option value="nurse">Nurse</option>
			<option value="paramedic">Paramedic</option>
			<option value="pharmacist">Pharmacist</option>
			<option value="allied-health">Allied-health professional</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Date and time of encounter" inputId="context-encounteredAt">
		<TextInput
			id="context-encounteredAt"
			label="Date and time of encounter"
			type="datetime-local"
			class="date-input"
			bind:value={c.encounteredAt}
		/>
	</Field>

	<Field label="Care setting" required inputId="context-careSetting">
		<Select id="context-careSetting" label="Care setting" required bind:value={c.careSetting}>
			<option value="">— Select —</option>
			<option value="general-practice">General practice</option>
			<option value="outpatient">Outpatient clinic</option>
			<option value="ward">Hospital ward</option>
			<option value="emergency-department">Emergency department</option>
			<option value="community">Community / allied-health</option>
			<option value="telehealth">Telehealth</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Encounter type" inputId="context-encounterType">
		<Select id="context-encounterType" label="Encounter type" bind:value={c.encounterType}>
			<option value="">— Select —</option>
			<option value="new-problem">New problem</option>
			<option value="follow-up">Follow-up</option>
			<option value="review">Review</option>
			<option value="other">Other</option>
		</Select>
	</Field>
</Fieldset>
