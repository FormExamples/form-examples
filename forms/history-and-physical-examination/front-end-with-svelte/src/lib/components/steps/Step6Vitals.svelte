<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const v = assessment.data.vitals;
</script>

<Fieldset legend="Step 6 of 8 — Vital signs">
	<p class="hint">
		Record the observations available at clerking. Values outside the normal range are flagged
		(NEWS2).
	</p>

	<Field label="Temperature (°C)" description="Normal 36.1-38.0 °C." inputId="vitals-temperature">
		<NumberInput
			id="vitals-temperature"
			label="Temperature in degrees Celsius"
			min={25}
			max={45}
			step={0.1}
			bind:value={v.temperature}
		/>
	</Field>

	<Field label="Heart rate (bpm)" description="Normal 51-90 bpm." inputId="vitals-heartRate">
		<NumberInput
			id="vitals-heartRate"
			label="Heart rate in beats per minute"
			min={0}
			max={300}
			step={1}
			bind:value={v.heartRate}
		/>
	</Field>

	<Field
		label="Respiratory rate (/min)"
		description="Normal 12-20 /min."
		inputId="vitals-respiratoryRate"
	>
		<NumberInput
			id="vitals-respiratoryRate"
			label="Respiratory rate per minute"
			min={0}
			max={80}
			step={1}
			bind:value={v.respiratoryRate}
		/>
	</Field>

	<Field
		label="Systolic blood pressure (mmHg)"
		description="Normal 111-219 mmHg."
		inputId="vitals-systolicBloodPressure"
	>
		<NumberInput
			id="vitals-systolicBloodPressure"
			label="Systolic blood pressure in mmHg"
			min={0}
			max={300}
			step={1}
			bind:value={v.systolicBloodPressure}
		/>
	</Field>

	<Field
		label="Oxygen saturation (%)"
		description="Normal 96% or above."
		inputId="vitals-oxygenSaturation"
	>
		<NumberInput
			id="vitals-oxygenSaturation"
			label="Oxygen saturation percentage"
			min={0}
			max={100}
			step={1}
			bind:value={v.oxygenSaturation}
		/>
	</Field>

	<Field
		label="Consciousness level (AVPU)"
		description="Anything other than Alert is flagged."
		inputId="vitals-consciousnessLevel"
	>
		<Select
			id="vitals-consciousnessLevel"
			label="Consciousness level (AVPU)"
			bind:value={v.consciousnessLevel}
		>
			<option value="">— Select —</option>
			<option value="alert">Alert</option>
			<option value="voice">Responds to voice</option>
			<option value="pain">Responds to pain</option>
			<option value="unresponsive">Unresponsive</option>
		</Select>
	</Field>
</Fieldset>
