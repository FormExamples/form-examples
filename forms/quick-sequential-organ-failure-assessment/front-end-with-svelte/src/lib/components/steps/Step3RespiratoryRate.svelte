<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateQsofaGrade } from '$lib/engine/qsofa-grader';
	import { pointColor } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';

	const r = assessment.data.respiratory;
	const point = $derived(calculateQsofaGrade(assessment.data).respiratoryRatePoint);
</script>

<Fieldset legend="Step 3 of 6 — Respiratory rate">
	<p class="hint">
		Criterion 1 — scores 1 point when the respiratory rate is 22 breaths/min or more.
	</p>

	<Field
		label="Measured respiratory rate (breaths/min)"
		description="Positive (1 point) when >= 22 breaths per minute."
		inputId="respiratory-respiratoryRate"
	>
		<NumberInput
			id="respiratory-respiratoryRate"
			label="Measured respiratory rate"
			min={0}
			max={80}
			step={1}
			bind:value={r.respiratoryRate}
		/>
	</Field>

	<Field label="Criterion 1 point">
		<span class="inline-block rounded-full border px-3 py-1 text-sm font-bold {pointColor(point)}">
			{point} point {point === 1 ? '(positive)' : '(negative)'}
		</span>
	</Field>
</Fieldset>
