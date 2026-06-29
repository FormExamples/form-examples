<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';

	const v = assessment.data.vitalSigns;
</script>

<Fieldset legend="Vital Signs">
	<p class="hint">Current vital sign measurements.</p>

	<div class="field-grid">
		<Field label="Blood Pressure - Systolic (mmHg)" required inputId="bpSystolic">
			<NumberInput id="bpSystolic" label="Systolic" min={60} max={250} required bind:value={v.bloodPressureSystolic} />
		</Field>
		<Field label="Blood Pressure - Diastolic (mmHg)" required inputId="bpDiastolic">
			<NumberInput id="bpDiastolic" label="Diastolic" min={30} max={150} required bind:value={v.bloodPressureDiastolic} />
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Weight (kg)" inputId="weight">
			<NumberInput id="weight" label="Weight" min={30} max={300} step={0.1} bind:value={v.weight} />
		</Field>
		<Field label="Height (cm)" inputId="height">
			<NumberInput id="height" label="Height" min={100} max={250} step={0.1} bind:value={v.height} />
		</Field>
	</div>

	<Field label="BMI (kg/m²)" inputId="bmi">
		<NumberInput id="bmi" label="BMI" min={10} max={80} step={0.1} bind:value={v.bmi} />
	</Field>

	<Field label="Fundal Height (cm)" inputId="fundalHeight">
		<NumberInput id="fundalHeight" label="Fundal height" min={10} max={50} step={0.5} bind:value={v.fundalHeight} />
	</Field>

	<Field label="Fetal Heart Rate (bpm)" inputId="fetalHeartRate">
		<NumberInput id="fetalHeartRate" label="Fetal heart rate" min={60} max={220} bind:value={v.fetalHeartRate} />
	</Field>
</Fieldset>

<style>
	.field-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
	@media (max-width: 640px) { .field-grid { grid-template-columns: 1fr; } }
</style>
