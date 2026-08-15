<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { calculateCentorGrade } from '#lib/engine/centor-grader.js';
	import { pointColor } from '#lib/engine/utils.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const c = assessment.data.cough;
	const point = $derived(calculateCentorGrade(assessment.data).coughAbsentPoint);
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Step 6 of 8 — Cough">
	<p class="hint">
		Criterion 4 — scores 1 point when cough is absent. A present cough points away from
		streptococcal infection.
	</p>

	<Field label="Is cough absent?">
		<RadioGroup label="Is cough absent?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="cough-absenceOfCough"
						value={opt.value}
						bind:group={c.absenceOfCough}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Criterion 4 point">
		<span class="inline-block rounded-full border px-3 py-1 text-sm font-bold {pointColor(point)}">
			{point} point {point === 1 ? '(positive)' : '(negative)'}
		</span>
	</Field>
</Fieldset>
