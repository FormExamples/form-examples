<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateCurb65Grade } from '$lib/engine/curb65-grader';
	import { pointColor } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';

	const a = assessment.data.age;
	const point = $derived(calculateCurb65Grade(assessment.data).ageScore);
</script>

<Fieldset legend="Step 7 of 9 — Age (65)">
	<p class="hint">Criterion 65 — scores 1 point when the patient is 65 years or older.</p>

	<Field
		label="Age (years)"
		description="Positive (1 point) when >= 65 years."
		inputId="age-ageYears"
	>
		<NumberInput
			id="age-ageYears"
			label="Age (years)"
			min={0}
			max={120}
			step={1}
			bind:value={a.ageYears}
		/>
	</Field>

	<Field label="Criterion 65 point">
		<span class="inline-block rounded-full border px-3 py-1 text-sm font-bold {pointColor(point)}">
			{point} point {point === 1 ? '(positive)' : '(negative)'}
		</span>
	</Field>
</Fieldset>
