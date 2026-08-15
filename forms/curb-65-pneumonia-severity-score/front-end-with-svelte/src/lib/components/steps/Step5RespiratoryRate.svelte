<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { calculateCurb65Grade } from '#lib/engine/curb65-grader.js';
	import { pointColor } from '#lib/engine/utils.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';

	const r = assessment.data.respiratory;
	const point = $derived(calculateCurb65Grade(assessment.data).respiratoryRateScore);
</script>

<Fieldset legend="Step 5 of 9 — Respiratory rate (R)">
	<p class="hint">
		Criterion R — scores 1 point when the respiratory rate is 30 breaths/min or more.
	</p>

	<Field
		label="Measured respiratory rate (breaths/min)"
		description="Positive (1 point) when >= 30 breaths per minute."
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

	<Field label="Criterion R point">
		<span class="inline-block rounded-full border px-3 py-1 text-sm font-bold {pointColor(point)}">
			{point} point {point === 1 ? '(positive)' : '(negative)'}
		</span>
	</Field>
</Fieldset>
