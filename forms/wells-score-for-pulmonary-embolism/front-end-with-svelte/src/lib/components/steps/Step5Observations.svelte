<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateWellsGrade } from '$lib/engine/wells-pe-grader';
	import { pointColor } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';

	const o = assessment.data.observations;
	const point = $derived(
		calculateWellsGrade(assessment.data).criterionPoints['heart-rate-over-100']
	);
</script>

<Fieldset legend="Step 5 of 6 — Observations">
	<p class="hint">
		Criterion 3 — a measured heart rate greater than 100 beats per minute scores +1.5 points. Leave
		blank if unmeasured.
	</p>

	<Field label="Heart rate (beats per minute)" inputId="observations-heartRate">
		<NumberInput
			id="observations-heartRate"
			label="Heart rate (beats per minute)"
			min={0}
			max={300}
			step={1}
			placeholder="e.g. 96"
			bind:value={o.heartRate}
		/>
	</Field>

	<Field label="Points from this step (heart rate > 100)">
		<span class="inline-block rounded-full border px-3 py-1 text-sm font-bold {pointColor(point)}">
			+{point}
		</span>
	</Field>
</Fieldset>
