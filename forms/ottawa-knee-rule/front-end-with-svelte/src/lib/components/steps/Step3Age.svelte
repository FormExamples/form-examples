<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { gradeOttawaKnee } from '#lib/engine/ottawa-knee-grader.js';
	import { criterionColor } from '#lib/engine/utils.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';

	const a = assessment.data.age;
	const grade = $derived(gradeOttawaKnee(assessment.data));
</script>

<Fieldset legend="Step 3 of 7 — Age">
	<p class="hint">Criterion 1 — a knee radiograph is indicated when the patient is aged 55 years or older.</p>

	<Field label="Patient age in years" inputId="age-ageYears">
		<NumberInput
			id="age-ageYears"
			label="Patient age in years"
			min={0}
			max={120}
			step={1}
			placeholder="e.g. 63"
			bind:value={a.ageYears}
		/>
	</Field>

	<Field label="Criterion 1 — age 55 years or older">
		<span
			class="inline-block rounded-full border px-3 py-1 text-sm font-bold {criterionColor(grade.ageCriterion)}"
		>
			{grade.ageCriterion ? 'Present — X-ray indicated' : 'Absent'}
		</span>
	</Field>
</Fieldset>
