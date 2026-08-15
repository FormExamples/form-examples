<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { calculateTimiGrade } from '#lib/engine/timi-grader.js';
	import { pointColor } from '#lib/engine/utils.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const r = assessment.data.riskProfile;
	const grade = $derived(calculateTimiGrade(assessment.data));
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Step 3 of 7 — Age and coronary risk factors">
	<p class="hint">Criteria 1 and 2 — each scores 1 point when present.</p>

	<Field
		label="Is the patient aged 65 years or older?"
		description="Criterion 1 — scores 1 point when age &ge; 65 years."
	>
		<RadioGroup label="Is the patient aged 65 years or older?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="riskProfile-ageOver65"
						value={opt.value}
						bind:group={r.ageOver65}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Criterion 1 point">
		<span class="inline-block rounded-full border px-3 py-1 text-sm font-bold {pointColor(grade.agePoint)}">
			{grade.agePoint} point {grade.agePoint === 1 ? '(positive)' : '(negative)'}
		</span>
	</Field>

	<Field
		label="Three or more coronary risk factors?"
		description="Criterion 2 — at least three of: hypertension, hypercholesterolaemia, diabetes, current smoking, family history of premature CAD."
	>
		<RadioGroup label="Three or more coronary risk factors?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="riskProfile-threeOrMoreCadRiskFactors"
						value={opt.value}
						bind:group={r.threeOrMoreCadRiskFactors}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Criterion 2 point">
		<span class="inline-block rounded-full border px-3 py-1 text-sm font-bold {pointColor(grade.riskFactorPoint)}">
			{grade.riskFactorPoint} point {grade.riskFactorPoint === 1 ? '(positive)' : '(negative)'}
		</span>
	</Field>
</Fieldset>
