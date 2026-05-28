<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';

	const a = assessment.data.assessment;
</script>

<Fieldset
	title="Assessment"
	description="The third part of the SBAR framework. Describe what is wrong with the patient and the need for referral. Include current vital signs."
>
	<TextAreaInput
		label="Clinical assessment & need for referral"
		name="clinicalAssessment"
		bind:value={a.clinicalAssessment}
		rows={4}
		required
	/>

	<h3 class="mt-6 mb-2 text-base font-semibold text-gray-800">Current vital signs</h3>
	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<NumberInput
			label="Heart rate"
			name="heartRate"
			bind:value={a.vitalSigns.heartRate}
			unit="bpm"
			min={0}
			max={300}
		/>
		<NumberInput
			label="Respiratory rate"
			name="respiratoryRate"
			bind:value={a.vitalSigns.respiratoryRate}
			unit="/min"
			min={0}
			max={80}
		/>
		<NumberInput
			label="Systolic blood pressure"
			name="systolicBloodPressure"
			bind:value={a.vitalSigns.systolicBloodPressure}
			unit="mmHg"
			min={0}
			max={300}
		/>
		<NumberInput
			label="Diastolic blood pressure"
			name="diastolicBloodPressure"
			bind:value={a.vitalSigns.diastolicBloodPressure}
			unit="mmHg"
			min={0}
			max={250}
		/>
		<NumberInput
			label="Temperature"
			name="temperatureCelsius"
			bind:value={a.vitalSigns.temperatureCelsius}
			unit="°C"
			step={0.1}
			min={25}
			max={45}
		/>
		<NumberInput
			label="Oxygen saturation"
			name="oxygenSaturation"
			bind:value={a.vitalSigns.oxygenSaturation}
			unit="%"
			min={0}
			max={100}
		/>
		<NumberInput
			label="Glasgow Coma Scale"
			name="glasgowComaScale"
			bind:value={a.vitalSigns.glasgowComaScale}
			unit="3–15"
			min={3}
			max={15}
		/>
	</div>
</Fieldset>
