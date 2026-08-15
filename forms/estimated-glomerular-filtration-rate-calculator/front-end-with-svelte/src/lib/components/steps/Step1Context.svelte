<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const c = assessment.data.context;
</script>

<Fieldset legend="Step 1 of 4 — Assessment context">
	<p class="hint">
		Who is interpreting the result, when, where, and the estimating equation. The engine computes
		the CKD-EPI 2021 creatinine equation (race-free).
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
			<option value="pharmacist">Pharmacist</option>
			<option value="laboratory">Laboratory staff</option>
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
			<option value="secondary-care">Secondary care</option>
			<option value="laboratory">Laboratory</option>
			<option value="pharmacy">Pharmacy</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field
		label="Estimating equation"
		description="This calculator computes CKD-EPI 2021 creatinine (race-free); other options are recorded for context only."
		inputId="context-equation"
	>
		<Select id="context-equation" label="Estimating equation" bind:value={c.equation}>
			<option value="ckd-epi-2021-creatinine">CKD-EPI 2021 creatinine (race-free)</option>
			<option value="ckd-epi-2021-cystatin-c">CKD-EPI 2021 cystatin C</option>
			<option value="mdrd">MDRD (4-variable)</option>
		</Select>
	</Field>
</Fieldset>
