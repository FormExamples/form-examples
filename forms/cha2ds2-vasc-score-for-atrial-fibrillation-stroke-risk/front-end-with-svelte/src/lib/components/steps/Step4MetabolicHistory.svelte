<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { calculateCha2ds2VascGrade } from '#lib/engine/cha2ds2vasc-grader.js';
	import { pointColor } from '#lib/engine/utils.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const m = assessment.data.metabolic;
	const grade = $derived(calculateCha2ds2VascGrade(assessment.data));
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Step 4 of 6 — Metabolic and thromboembolic history">
	<p class="hint">
		Criteria D and S2 — diabetes mellitus (1 point), and prior stroke / TIA / thromboembolism (2
		points, the strongest single risk factor).
	</p>

	<Field
		label="Diabetes mellitus? (D)"
		description="Fasting glucose > 125 mg/dL (7 mmol/L) or on hypoglycaemic treatment. Scores 1 point when yes."
	>
		<RadioGroup label="Diabetes mellitus?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="metabolic-diabetes"
						value={opt.value}
						bind:group={m.diabetes}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>
	<Field label="Criterion D point">
		<span class="inline-block rounded-full border px-3 py-1 text-sm font-bold {pointColor(grade.diabetesPoint)}">
			{grade.diabetesPoint} point
		</span>
	</Field>

	<Field
		label="Prior stroke, TIA, or thromboembolism? (S2)"
		description="History of stroke, transient ischaemic attack, or systemic embolism. Scores 2 points when yes."
	>
		<RadioGroup label="Prior stroke, TIA, or thromboembolism?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="metabolic-priorStrokeTiaThromboembolism"
						value={opt.value}
						bind:group={m.priorStrokeTiaThromboembolism}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>
	<Field label="Criterion S2 points">
		<span class="inline-block rounded-full border px-3 py-1 text-sm font-bold {pointColor(grade.strokePoint)}">
			{grade.strokePoint} points
		</span>
	</Field>
</Fieldset>
