<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { gradeOttawaKnee } from '#lib/engine/ottawa-knee-grader.js';
	import { criterionColor } from '#lib/engine/utils.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const f = assessment.data.flexion;
	const grade = $derived(gradeOttawaKnee(assessment.data));
</script>

<Fieldset legend="Step 5 of 7 — Knee flexion">
	<p class="hint">
		Criterion 4 — a knee radiograph is indicated when the patient is unable to flex the knee to 90
		degrees.
	</p>

	<Field label="Is the patient unable to flex the knee to 90 degrees?">
		<RadioGroup label="Unable to flex the knee to 90 degrees">
			<label>
				<input
					type="radio"
					class="radio-input"
					name="flexion-unableToFlex90"
					value="yes"
					bind:group={f.unableToFlex90}
				/> Yes (unable to flex to 90 degrees)
			</label>
			<label>
				<input
					type="radio"
					class="radio-input"
					name="flexion-unableToFlex90"
					value="no"
					bind:group={f.unableToFlex90}
				/> No (able to flex to 90 degrees)
			</label>
		</RadioGroup>
	</Field>

	<Field label="Criterion 4 — inability to flex the knee to 90 degrees">
		<span
			class="inline-block rounded-full border px-3 py-1 text-sm font-bold {criterionColor(
				grade.flexionCriterion
			)}"
		>
			{grade.flexionCriterion ? 'Present — X-ray indicated' : 'Absent'}
		</span>
	</Field>
</Fieldset>
