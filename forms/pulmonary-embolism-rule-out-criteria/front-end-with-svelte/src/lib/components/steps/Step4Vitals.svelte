<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { criterionStatusColor, criterionStatusLabel } from '#lib/engine/utils.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';

	const v = assessment.data.vitals;
	// Criterion 2: heart rate under 100. Criterion 3: SpO2 at least 95.
	const hrSatisfied = $derived(v.heartRate !== null && v.heartRate < 100);
	const spo2Satisfied = $derived(v.oxygenSaturation !== null && v.oxygenSaturation >= 95);
</script>

<Fieldset legend="Step 4 of 6 — Vital signs">
	<p class="hint">
		Heart rate and oxygen saturation on room air. Criterion 2 is satisfied at a heart rate under
		100 beats/min; criterion 3 is satisfied at an SpO2 of at least 95%. A missing value cannot
		satisfy its criterion.
	</p>

	<Field
		label="Heart rate (beats/min)"
		description="Criterion 2 is satisfied when heart rate is under 100 beats/min."
		required
		inputId="vitals-heartRate"
	>
		<NumberInput
			id="vitals-heartRate"
			label="Heart rate (beats/min)"
			min={0}
			max={300}
			required
			bind:value={v.heartRate}
		/>
	</Field>

	<Field label="Criterion 2 status (heart rate under 100)">
		<span class="inline-block rounded-full border px-3 py-1 text-sm font-bold {criterionStatusColor(hrSatisfied)}">
			{criterionStatusLabel(hrSatisfied)}
		</span>
	</Field>

	<Field
		label="Oxygen saturation (SpO2 %)"
		description="Criterion 3 is satisfied when SpO2 is at least 95% on room air."
		required
		inputId="vitals-oxygenSaturation"
	>
		<NumberInput
			id="vitals-oxygenSaturation"
			label="Oxygen saturation (SpO2 %)"
			min={0}
			max={100}
			required
			bind:value={v.oxygenSaturation}
		/>
	</Field>

	<Field label="Criterion 3 status (SpO2 at least 95%)">
		<span class="inline-block rounded-full border px-3 py-1 text-sm font-bold {criterionStatusColor(spo2Satisfied)}">
			{criterionStatusLabel(spo2Satisfied)}
		</span>
	</Field>
</Fieldset>
