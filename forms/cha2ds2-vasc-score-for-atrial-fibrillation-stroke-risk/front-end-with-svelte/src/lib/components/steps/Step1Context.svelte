<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const c = assessment.data.context;
</script>

<Fieldset legend="Step 1 of 6 — Assessment context">
	<p class="hint">Who is assessing, when, where, and the type of atrial fibrillation.</p>

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
			<option value="primary-care">Primary care</option>
			<option value="cardiology">Cardiology / arrhythmia clinic</option>
			<option value="anticoagulation-clinic">Anticoagulation clinic</option>
			<option value="emergency-department">Emergency department</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Atrial fibrillation type" inputId="context-atrialFibrillationType">
		<Select
			id="context-atrialFibrillationType"
			label="Atrial fibrillation type"
			bind:value={c.atrialFibrillationType}
		>
			<option value="">— Select —</option>
			<option value="paroxysmal">Paroxysmal</option>
			<option value="persistent">Persistent</option>
			<option value="permanent">Permanent</option>
			<option value="flutter">Atrial flutter</option>
		</Select>
	</Field>
</Fieldset>
