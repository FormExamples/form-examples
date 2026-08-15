<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { calculateHasBledGrade } from '#lib/engine/hasbled-grader.js';
	import { pointColor } from '#lib/engine/utils.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const da = assessment.data.drugsAlcohol;
	const grade = $derived(calculateHasBledGrade(assessment.data));
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Step 8 of 9 — Drugs and alcohol (D, D)">
	<p class="hint">
		Two independent criteria. Drugs scores 1 point for concomitant antiplatelet agents or NSAIDs.
		Alcohol scores 1 point at &ge; 8 units per week.
	</p>

	<Field label="Concomitant antiplatelet agents or NSAIDs?">
		<RadioGroup label="Concomitant antiplatelet agents or NSAIDs?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="drugsAlcohol-antiplateletOrNsaid"
						value={opt.value}
						bind:group={da.antiplateletOrNsaid}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Drugs (D) point">
		<span
			class="inline-block rounded-full border px-3 py-1 text-sm font-bold {pointColor(
				grade.drugsPoint
			)}"
		>
			{grade.drugsPoint} point {grade.drugsPoint === 1 ? '(positive)' : '(negative)'}
		</span>
	</Field>

	<Field
		label="Alcohol (units per week)"
		description="Scores 1 point when consumption is 8 or more units per week."
		inputId="drugsAlcohol-alcoholUnitsPerWeek"
	>
		<NumberInput
			id="drugsAlcohol-alcoholUnitsPerWeek"
			label="Alcohol units per week"
			min={0}
			max={200}
			step={1}
			bind:value={da.alcoholUnitsPerWeek}
		/>
	</Field>

	<Field label="Alcohol (D) point">
		<span
			class="inline-block rounded-full border px-3 py-1 text-sm font-bold {pointColor(
				grade.alcoholPoint
			)}"
		>
			{grade.alcoholPoint} point {grade.alcoholPoint === 1 ? '(positive)' : '(negative)'}
		</span>
	</Field>
</Fieldset>
