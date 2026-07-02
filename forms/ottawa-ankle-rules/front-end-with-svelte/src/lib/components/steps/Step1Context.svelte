<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const c = assessment.data.context;
</script>

<Fieldset legend="Step 1 of 8 — Assessment context">
	<p class="hint">Who is assessing, when, where, which side, and how long since the injury.</p>

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
			<option value="nurse-practitioner">Nurse practitioner</option>
			<option value="paramedic">Paramedic</option>
			<option value="physiotherapist">Physiotherapist</option>
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
			<option value="minor-injury-unit">Minor-injury unit</option>
			<option value="urgent-care">Urgent care</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Injured side" required inputId="context-injuredSide">
		<Select id="context-injuredSide" label="Injured side" required bind:value={c.injuredSide}>
			<option value="">— Select —</option>
			<option value="left">Left</option>
			<option value="right">Right</option>
		</Select>
	</Field>

	<Field label="Hours since injury" inputId="context-hoursSinceInjury">
		<NumberInput
			id="context-hoursSinceInjury"
			label="Hours since injury"
			min={0}
			step={0.5}
			bind:value={c.hoursSinceInjury}
		/>
	</Field>
</Fieldset>
