<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const e = assessment.data.encounter;
</script>

<Fieldset legend="Step 1 of 7 — Encounter context">
	<p class="hint">The transition of care being reconciled, the setting, and who is reconciling.</p>

	<Field label="Reconciliation type" required inputId="encounter-reconciliationType">
		<Select
			id="encounter-reconciliationType"
			label="Reconciliation type"
			required
			bind:value={e.reconciliationType}
		>
			<option value="">— Select —</option>
			<option value="admission">Admission</option>
			<option value="transfer">Transfer</option>
			<option value="discharge">Discharge</option>
		</Select>
	</Field>

	<Field label="Care setting" required inputId="encounter-careSetting">
		<Select id="encounter-careSetting" label="Care setting" required bind:value={e.careSetting}>
			<option value="">— Select —</option>
			<option value="emergency-department">Emergency department</option>
			<option value="acute-medical-unit">Acute medical unit</option>
			<option value="surgical-admissions">Surgical admissions</option>
			<option value="ward">Ward</option>
			<option value="critical-care">Critical care</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Date and time of reconciliation" inputId="encounter-reconciledAt">
		<TextInput
			id="encounter-reconciledAt"
			label="Date and time of reconciliation"
			type="datetime-local"
			class="date-input"
			bind:value={e.reconciledAt}
		/>
	</Field>

	<Field label="Reconciling clinician name" required inputId="encounter-clinicianName">
		<TextInput
			id="encounter-clinicianName"
			label="Reconciling clinician name"
			placeholder="e.g. Priya Nair"
			required
			bind:value={e.clinicianName}
		/>
	</Field>

	<Field label="Clinician role" required inputId="encounter-clinicianRole">
		<Select id="encounter-clinicianRole" label="Clinician role" required bind:value={e.clinicianRole}>
			<option value="">— Select —</option>
			<option value="pharmacist">Pharmacist</option>
			<option value="pharmacy-technician">Pharmacy technician</option>
			<option value="prescriber">Prescriber</option>
			<option value="nurse">Nurse</option>
			<option value="other">Other</option>
		</Select>
	</Field>
</Fieldset>
