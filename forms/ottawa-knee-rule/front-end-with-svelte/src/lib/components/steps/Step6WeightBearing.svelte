<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { gradeOttawaKnee } from '#lib/engine/ottawa-knee-grader.js';
	import { criterionColor } from '#lib/engine/utils.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const w = assessment.data.weightBearing;
	const grade = $derived(gradeOttawaKnee(assessment.data));
</script>

<Fieldset legend="Step 6 of 7 — Weight-bearing">
	<p class="hint">
		Criterion 5 — inability to bear weight means the patient cannot take four steps (transferring
		weight twice onto each leg) both immediately after the injury and in the emergency department,
		regardless of limping.
	</p>

	<Field label="Is the patient unable to bear weight (take four steps) both immediately after the injury and now?">
		<RadioGroup label="Unable to bear weight">
			<label>
				<input
					type="radio"
					class="radio-input"
					name="weightBearing-unableToBearWeight"
					value="yes"
					bind:group={w.unableToBearWeight}
				/> Yes (unable to take four steps)
			</label>
			<label>
				<input
					type="radio"
					class="radio-input"
					name="weightBearing-unableToBearWeight"
					value="no"
					bind:group={w.unableToBearWeight}
				/> No (able to take four steps)
			</label>
		</RadioGroup>
	</Field>

	<Field label="Criterion 5 — inability to bear weight (four steps)">
		<span
			class="inline-block rounded-full border px-3 py-1 text-sm font-bold {criterionColor(
				grade.weightBearingCriterion
			)}"
		>
			{grade.weightBearingCriterion ? 'Present — X-ray indicated' : 'Absent'}
		</span>
	</Field>
</Fieldset>
