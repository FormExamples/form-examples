<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const c = assessment.data.context;
</script>

<Fieldset legend="Step 1 of 9 — Assessment context">
	<p class="hint">Who is assessing, when, where, and the anticoagulation decision in view.</p>

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
			<option value="cardiology">Cardiology</option>
			<option value="general-practice">General practice</option>
			<option value="anticoagulation-clinic">Anticoagulation clinic</option>
			<option value="acute-medical">Acute medical</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Anticoagulation status" inputId="context-anticoagulationStatus">
		<Select
			id="context-anticoagulationStatus"
			label="Anticoagulation status"
			bind:value={c.anticoagulationStatus}
		>
			<option value="">— Select —</option>
			<option value="on">On anticoagulation</option>
			<option value="considering">Considering anticoagulation</option>
		</Select>
	</Field>

	<Field
		label="Paired CHA2DS2-VASc score"
		description="Optional stroke-risk score (0-9), read alongside HAS-BLED. Context only; not part of the bleeding score."
		inputId="context-chaDsVascScore"
	>
		<NumberInput
			id="context-chaDsVascScore"
			label="Paired CHA2DS2-VASc score"
			min={0}
			max={9}
			step={1}
			bind:value={c.chaDsVascScore}
		/>
	</Field>
</Fieldset>
