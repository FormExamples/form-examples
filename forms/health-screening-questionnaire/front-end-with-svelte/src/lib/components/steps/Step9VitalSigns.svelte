<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import { computeBodyMassIndex } from '$lib/engine/grader';
	import { questionnaireStore } from '$lib/stores/questionnaire.svelte';

	const d = questionnaireStore.data;
	const bmi = $derived(computeBodyMassIndex(d));
</script>

<Fieldset legend="9. Vital Signs / Basic Measurements">
	<p class="hint">All optional — this form does not mandate a physical exam.</p>

	<Field label="Height (cm)" inputId="vitals-heightAsCm">
		<NumberInput id="vitals-heightAsCm" label="Height (cm)" min={30} max={250} step="0.1" bind:value={d.vitals.heightAsCm} />
	</Field>
	<Field label="Weight (kg)" inputId="vitals-weightAsKg">
		<NumberInput id="vitals-weightAsKg" label="Weight (kg)" min={1} max={400} step="0.1" bind:value={d.vitals.weightAsKg} />
	</Field>
	<Field label="Body mass index (auto-computed)" inputId="vitals-bodyMassIndex">
		<p id="vitals-bodyMassIndex" class="font-semibold">{bmi === null ? '—' : `${bmi} kg/m²`}</p>
	</Field>
	<Field label="Resting blood pressure — systolic (mmHg)" inputId="vitals-restingBloodPressureSystolic">
		<NumberInput id="vitals-restingBloodPressureSystolic" label="Resting blood pressure — systolic (mmHg)" min={40} max={300} bind:value={d.vitals.restingBloodPressureSystolic} />
	</Field>
	<Field label="Resting blood pressure — diastolic (mmHg)" inputId="vitals-restingBloodPressureDiastolic">
		<NumberInput id="vitals-restingBloodPressureDiastolic" label="Resting blood pressure — diastolic (mmHg)" min={20} max={200} bind:value={d.vitals.restingBloodPressureDiastolic} />
	</Field>
	<Field label="Resting heart rate (bpm)" inputId="vitals-restingHeartRate">
		<NumberInput id="vitals-restingHeartRate" label="Resting heart rate (bpm)" min={20} max={250} bind:value={d.vitals.restingHeartRate} />
	</Field>
</Fieldset>
