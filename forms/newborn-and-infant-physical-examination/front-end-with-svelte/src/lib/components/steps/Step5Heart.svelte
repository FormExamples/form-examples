<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateNipeGrade } from '$lib/engine/nipe-grader';
	import { componentResultColor, componentResultLabel } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';

	const h = assessment.data.heart;
	const grade = $derived(calculateNipeGrade(assessment.data));
</script>

<Fieldset legend="Step 5 of 9 — Heart (key component)">
	<p class="hint">
		Heart sounds, femoral pulses, central cyanosis, and pre-/post-ductal saturations. Any
		abnormality is a Refer.
	</p>

	<Field label="Heart murmur" inputId="heart-heartMurmur">
		<Select id="heart-heartMurmur" label="Heart murmur" bind:value={h.heartMurmur}>
			<option value="">— Select —</option>
			<option value="none">None</option>
			<option value="present">Present</option>
			<option value="not-examined">Not examined</option>
		</Select>
	</Field>

	<Field label="Femoral pulse — right" inputId="heart-femoralPulsesRight">
		<Select id="heart-femoralPulsesRight" label="Femoral pulse — right" bind:value={h.femoralPulsesRight}>
			<option value="">— Select —</option>
			<option value="present">Present</option>
			<option value="weak">Weak</option>
			<option value="absent">Absent</option>
			<option value="not-examined">Not examined</option>
		</Select>
	</Field>

	<Field label="Femoral pulse — left" inputId="heart-femoralPulsesLeft">
		<Select id="heart-femoralPulsesLeft" label="Femoral pulse — left" bind:value={h.femoralPulsesLeft}>
			<option value="">— Select —</option>
			<option value="present">Present</option>
			<option value="weak">Weak</option>
			<option value="absent">Absent</option>
			<option value="not-examined">Not examined</option>
		</Select>
	</Field>

	<Field label="Central cyanosis" inputId="heart-centralCyanosis">
		<Select id="heart-centralCyanosis" label="Central cyanosis" bind:value={h.centralCyanosis}>
			<option value="">— Select —</option>
			<option value="absent">Absent</option>
			<option value="present">Present</option>
			<option value="not-examined">Not examined</option>
		</Select>
	</Field>

	<Field
		label="Pre-ductal oxygen saturation (%)"
		description="Right hand. A saturation below 95% is a Refer trigger."
		inputId="heart-oxygenSaturationPreductal"
	>
		<NumberInput
			id="heart-oxygenSaturationPreductal"
			label="Pre-ductal oxygen saturation (%)"
			min={0}
			max={100}
			step={1}
			bind:value={h.oxygenSaturationPreductal}
		/>
	</Field>

	<Field
		label="Post-ductal oxygen saturation (%)"
		description="Either foot. A pre-/post-ductal difference above 3% is flagged."
		inputId="heart-oxygenSaturationPostductal"
	>
		<NumberInput
			id="heart-oxygenSaturationPostductal"
			label="Post-ductal oxygen saturation (%)"
			min={0}
			max={100}
			step={1}
			bind:value={h.oxygenSaturationPostductal}
		/>
	</Field>

	<Field label="Heart result">
		<span
			class="inline-block rounded-full border px-3 py-1 text-sm font-bold {componentResultColor(
				grade.heartResult
			)}"
		>
			{componentResultLabel(grade.heartResult)}
		</span>
	</Field>
</Fieldset>
