<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateCurb65Grade } from '$lib/engine/curb65-grader';
	import { pointColor } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';

	const b = assessment.data.bloodPressure;
	const point = $derived(calculateCurb65Grade(assessment.data).bloodPressureScore);
</script>

<Fieldset legend="Step 6 of 9 — Blood pressure (B)">
	<p class="hint">
		Criterion B — scores 1 point when systolic blood pressure is &lt; 90 mmHg, or diastolic is
		&le; 60 mmHg.
	</p>

	<Field
		label="Systolic blood pressure (mmHg)"
		description="Positive when < 90 mmHg."
		inputId="bloodPressure-systolicBp"
	>
		<NumberInput
			id="bloodPressure-systolicBp"
			label="Systolic blood pressure"
			min={0}
			max={300}
			step={1}
			bind:value={b.systolicBp}
		/>
	</Field>

	<Field
		label="Diastolic blood pressure (mmHg)"
		description="Positive when <= 60 mmHg."
		inputId="bloodPressure-diastolicBp"
	>
		<NumberInput
			id="bloodPressure-diastolicBp"
			label="Diastolic blood pressure"
			min={0}
			max={200}
			step={1}
			bind:value={b.diastolicBp}
		/>
	</Field>

	<Field label="Criterion B point">
		<span class="inline-block rounded-full border px-3 py-1 text-sm font-bold {pointColor(point)}">
			{point} point {point === 1 ? '(positive)' : '(negative)'}
		</span>
	</Field>
</Fieldset>
