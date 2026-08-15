<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { calculateGraceGrade } from '#lib/engine/grace-grader.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';

	const h = assessment.data.haemodynamics;
	const grade = $derived(calculateGraceGrade(assessment.data));
</script>

<Fieldset legend="Step 3 of 7 — Haemodynamics">
	<p class="hint">
		Heart rate (variable 2) increases the score; systolic blood pressure (variable 3) is inverse —
		lower pressures score higher.
	</p>

	<Field
		label="Heart rate (beats/min)"
		description="Variable 2 — higher rates add more points."
		inputId="haemodynamics-heartRate"
	>
		<NumberInput
			id="haemodynamics-heartRate"
			label="Heart rate (beats/min)"
			min={0}
			max={300}
			step={1}
			bind:value={h.heartRate}
		/>
	</Field>

	<Field label="Heart-rate points">
		<span class="inline-block rounded-full border border-base-300 bg-base-300 px-3 py-1 text-sm font-bold text-base-content">
			{grade.heartRatePoints} points
		</span>
	</Field>

	<Field
		label="Systolic blood pressure (mmHg)"
		description="Variable 3 — inverse weight: SBP &lt; 80 mmHg scores the most."
		inputId="haemodynamics-systolicBloodPressure"
	>
		<NumberInput
			id="haemodynamics-systolicBloodPressure"
			label="Systolic blood pressure (mmHg)"
			min={0}
			max={300}
			step={1}
			bind:value={h.systolicBloodPressure}
		/>
	</Field>

	<Field label="Systolic-BP points">
		<span class="inline-block rounded-full border border-base-300 bg-base-300 px-3 py-1 text-sm font-bold text-base-content">
			{grade.sbpPoints} points
		</span>
	</Field>
</Fieldset>
