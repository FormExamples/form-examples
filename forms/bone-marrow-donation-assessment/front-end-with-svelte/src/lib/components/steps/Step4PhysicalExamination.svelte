<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const d = assessment.data.physicalExamination;
</script>

<Fieldset legend="Physical Examination">
	<p class="hint">Observations and system examination findings.</p>

	<div class="grid grid-3">
		<Field label="BP Systolic (mmHg)" inputId="bpSystolic">
			<NumberInput id="bpSystolic" label="BP Systolic" min={50} max={300} bind:value={d.bpSystolic} />
		</Field>
		<Field label="BP Diastolic (mmHg)" inputId="bpDiastolic">
			<NumberInput id="bpDiastolic" label="BP Diastolic" min={30} max={200} bind:value={d.bpDiastolic} />
		</Field>
		<Field label="Heart Rate (bpm)" inputId="heartRate">
			<NumberInput id="heartRate" label="Heart Rate" min={20} max={250} bind:value={d.heartRate} />
		</Field>
		<Field label="Temperature (°C)" inputId="temperature">
			<NumberInput id="temperature" label="Temperature" min={30} max={45} step={0.1} bind:value={d.temperature} />
		</Field>
		<Field label="Respiratory Rate" inputId="respiratoryRate">
			<NumberInput id="respiratoryRate" label="Respiratory Rate" min={4} max={60} bind:value={d.respiratoryRate} />
		</Field>
		<Field label="Oxygen Saturation (%)" inputId="oxygenSaturation">
			<NumberInput id="oxygenSaturation" label="Oxygen Saturation" min={50} max={100} bind:value={d.oxygenSaturation} />
		</Field>
	</div>

	<Field label="General Appearance" inputId="generalAppearance">
		<Select id="generalAppearance" label="General Appearance" bind:value={d.generalAppearance}>
			<option value="">Select…</option>
			<option value="well">Well</option>
			<option value="unwell">Unwell</option>
			<option value="acutely-unwell">Acutely unwell</option>
		</Select>
	</Field>

	<div class="grid">
		<Field label="Cardiovascular Examination" inputId="cardiovascularExamination">
			<Select id="cardiovascularExamination" label="Cardiovascular Examination" bind:value={d.cardiovascularExamination}>
				<option value="">Select…</option>
				<option value="normal">Normal</option>
				<option value="abnormal">Abnormal</option>
			</Select>
		</Field>
		<Field label="Respiratory Examination" inputId="respiratoryExamination">
			<Select id="respiratoryExamination" label="Respiratory Examination" bind:value={d.respiratoryExamination}>
				<option value="">Select…</option>
				<option value="normal">Normal</option>
				<option value="abnormal">Abnormal</option>
			</Select>
		</Field>
		<Field label="Abdominal Examination" inputId="abdominalExamination">
			<Select id="abdominalExamination" label="Abdominal Examination" bind:value={d.abdominalExamination}>
				<option value="">Select…</option>
				<option value="normal">Normal</option>
				<option value="abnormal">Abnormal</option>
			</Select>
		</Field>
		<Field label="Venous Access Assessment" inputId="venousAccessAssessment">
			<Select id="venousAccessAssessment" label="Venous Access Assessment" bind:value={d.venousAccessAssessment}>
				<option value="">Select…</option>
				<option value="good">Good</option>
				<option value="adequate">Adequate</option>
				<option value="poor">Poor</option>
			</Select>
		</Field>
	</div>

	<Field label="Posterior Iliac Crest Assessment" inputId="posteriorIliacCrestAssessment">
		<Select id="posteriorIliacCrestAssessment" label="Posterior Iliac Crest Assessment" bind:value={d.posteriorIliacCrestAssessment}>
			<option value="">Select…</option>
			<option value="suitable">Suitable</option>
			<option value="unsuitable">Unsuitable</option>
		</Select>
	</Field>
</Fieldset>

<style>
	.grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}
	.grid.grid-3 {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}
	@media (max-width: 640px) {
		.grid,
		.grid.grid-3 {
			grid-template-columns: 1fr;
		}
	}
</style>
