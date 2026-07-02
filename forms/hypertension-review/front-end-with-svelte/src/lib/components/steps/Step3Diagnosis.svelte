<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const d = assessment.data.diagnosis;
</script>

<Fieldset legend="Step 3 of 12 — Diagnosis and comorbidity">
	<p class="hint">Comorbidities drive the applicable blood-pressure target.</p>

	<Field label="Date of hypertension diagnosis" inputId="diagnosis-diagnosisDate">
		<DateInput
			id="diagnosis-diagnosisDate"
			label="Date of hypertension diagnosis"
			bind:value={d.diagnosisDate}
		/>
	</Field>

	<Field
		label="Type 2 diabetes"
		description="Holds the clinic target at 140/90."
		inputId="diagnosis-type2Diabetes"
	>
		<Select id="diagnosis-type2Diabetes" label="Type 2 diabetes" bind:value={d.type2Diabetes}>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>

	<Field
		label="Chronic kidney disease (CKD)"
		description="With diabetes or ACR 70 mg/mmol and over tightens the target to 130/80."
		inputId="diagnosis-chronicKidneyDisease"
	>
		<Select
			id="diagnosis-chronicKidneyDisease"
			label="Chronic kidney disease (CKD)"
			bind:value={d.chronicKidneyDisease}
		>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>

	<Field label="Established cardiovascular disease" inputId="diagnosis-establishedCvd">
		<Select
			id="diagnosis-establishedCvd"
			label="Established cardiovascular disease"
			bind:value={d.establishedCvd}
		>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>

	<Field label="Atrial fibrillation" inputId="diagnosis-atrialFibrillation">
		<Select
			id="diagnosis-atrialFibrillation"
			label="Atrial fibrillation"
			bind:value={d.atrialFibrillation}
		>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>
</Fieldset>
