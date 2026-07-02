<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const fl = assessment.data.fluid;
</script>

<Fieldset legend="Step 4 of 9 — Fluid status and observations">
	<p class="hint">Weight, congestion signs, and vital signs.</p>

	<Field label="Weight (kg)" inputId="fluid-weightKg">
		<NumberInput
			id="fluid-weightKg"
			label="Weight (kg)"
			min={0}
			max={400}
			step={0.1}
			bind:value={fl.weightKg}
		/>
	</Field>

	<Field
		label="Weight change since last review (kg)"
		inputId="fluid-weightChangeKg"
		description="Positive = gain. A gain of 2 kg or more raises a fluid-overload flag."
	>
		<NumberInput
			id="fluid-weightChangeKg"
			label="Weight change since last review (kg)"
			min={-50}
			max={50}
			step={0.1}
			bind:value={fl.weightChangeKg}
		/>
	</Field>

	<Field label="Peripheral oedema" inputId="fluid-peripheralOedema">
		<Select id="fluid-peripheralOedema" label="Peripheral oedema" bind:value={fl.peripheralOedema}>
			<option value="">— Select —</option>
			<option value="none">None</option>
			<option value="mild">Mild</option>
			<option value="moderate">Moderate</option>
			<option value="severe">Severe</option>
		</Select>
	</Field>

	<Field label="Raised jugular venous pressure" inputId="fluid-raisedJvp">
		<Select id="fluid-raisedJvp" label="Raised jugular venous pressure" bind:value={fl.raisedJvp}>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>

	<Field label="Lung crackles" inputId="fluid-lungCrackles">
		<Select id="fluid-lungCrackles" label="Lung crackles" bind:value={fl.lungCrackles}>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>

	<Field label="Systolic blood pressure (mmHg)" inputId="fluid-systolicBloodPressure">
		<NumberInput
			id="fluid-systolicBloodPressure"
			label="Systolic blood pressure (mmHg)"
			min={40}
			max={300}
			step={1}
			bind:value={fl.systolicBloodPressure}
		/>
	</Field>

	<Field label="Diastolic blood pressure (mmHg)" inputId="fluid-diastolicBloodPressure">
		<NumberInput
			id="fluid-diastolicBloodPressure"
			label="Diastolic blood pressure (mmHg)"
			min={20}
			max={200}
			step={1}
			bind:value={fl.diastolicBloodPressure}
		/>
	</Field>

	<Field label="Heart rate (bpm)" inputId="fluid-heartRate">
		<NumberInput
			id="fluid-heartRate"
			label="Heart rate (bpm)"
			min={20}
			max={250}
			step={1}
			bind:value={fl.heartRate}
		/>
	</Field>

	<Field label="Heart rhythm" inputId="fluid-heartRhythm">
		<Select id="fluid-heartRhythm" label="Heart rhythm" bind:value={fl.heartRhythm}>
			<option value="">— Select —</option>
			<option value="sinus">Sinus</option>
			<option value="atrial-fibrillation">Atrial fibrillation</option>
			<option value="paced">Paced</option>
			<option value="other">Other</option>
		</Select>
	</Field>
</Fieldset>
