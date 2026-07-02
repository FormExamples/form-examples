<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateQsofaGrade } from '$lib/engine/qsofa-grader';
	import { pointColor } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';

	const c = assessment.data.circulation;
	const point = $derived(calculateQsofaGrade(assessment.data).systolicBloodPressurePoint);
</script>

<Fieldset legend="Step 5 of 6 — Systolic blood pressure">
	<p class="hint">
		Criterion 3 — scores 1 point when the systolic blood pressure is 100 mmHg or less.
	</p>

	<Field
		label="Measured systolic blood pressure (mmHg)"
		description="Positive (1 point) when <= 100 mmHg."
		inputId="circulation-systolicBloodPressure"
	>
		<NumberInput
			id="circulation-systolicBloodPressure"
			label="Measured systolic blood pressure"
			min={0}
			max={300}
			step={1}
			bind:value={c.systolicBloodPressure}
		/>
	</Field>

	<Field label="Criterion 3 point">
		<span class="inline-block rounded-full border px-3 py-1 text-sm font-bold {pointColor(point)}">
			{point} point {point === 1 ? '(positive)' : '(negative)'}
		</span>
	</Field>
</Fieldset>
