<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const cv = assessment.data.cardiovascularRisk;
</script>

<Fieldset legend="Step 7 of 12 — Cardiovascular risk">
	<p class="hint">QRISK 10-year risk, smoking status, and statin therapy.</p>

	<Field
		label="QRISK 10-year risk (%)"
		description="10% or above with no statin raises a high-CV-risk-untreated flag."
		inputId="cardiovascularRisk-qriskPercent"
	>
		<NumberInput
			id="cardiovascularRisk-qriskPercent"
			label="QRISK 10-year risk (%)"
			min={0}
			max={100}
			step={0.1}
			placeholder="e.g. 14.2"
			bind:value={cv.qriskPercent}
		/>
	</Field>

	<Field label="Smoking status" inputId="cardiovascularRisk-smokingStatus">
		<Select
			id="cardiovascularRisk-smokingStatus"
			label="Smoking status"
			bind:value={cv.smokingStatus}
		>
			<option value="">— Select —</option>
			<option value="never">Never</option>
			<option value="ex">Ex-smoker</option>
			<option value="current">Current</option>
		</Select>
	</Field>

	<Field label="On a statin" inputId="cardiovascularRisk-statinTherapy">
		<Select id="cardiovascularRisk-statinTherapy" label="On a statin" bind:value={cv.statinTherapy}>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>
</Fieldset>
