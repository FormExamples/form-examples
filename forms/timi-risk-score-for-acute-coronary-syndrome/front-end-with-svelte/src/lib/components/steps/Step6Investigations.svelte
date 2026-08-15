<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { calculateTimiGrade } from '#lib/engine/timi-grader.js';
	import { pointColor } from '#lib/engine/utils.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const inv = assessment.data.investigations;
	const grade = $derived(calculateTimiGrade(assessment.data));
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Step 6 of 7 — Investigations">
	<p class="hint">Criteria 6 and 7 — each scores 1 point when present.</p>

	<Field
		label="ST-segment deviation &ge; 0.5 mm on the presenting ECG?"
		description="Criterion 6 — ischaemic ST deviation on the presenting ECG."
	>
		<RadioGroup label="ST-segment deviation of 0.5 mm or more on the presenting ECG?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="investigations-stDeviation"
						value={opt.value}
						bind:group={inv.stDeviation}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Criterion 6 point">
		<span class="inline-block rounded-full border px-3 py-1 text-sm font-bold {pointColor(grade.stDeviationPoint)}">
			{grade.stDeviationPoint} point {grade.stDeviationPoint === 1 ? '(positive)' : '(negative)'}
		</span>
	</Field>

	<Field
		label="Positive cardiac marker (elevated troponin or CK-MB)?"
		description="Criterion 7 — myocardial injury on biomarker testing."
	>
		<RadioGroup label="Positive cardiac marker (elevated troponin or CK-MB)?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="investigations-positiveCardiacMarker"
						value={opt.value}
						bind:group={inv.positiveCardiacMarker}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Criterion 7 point">
		<span class="inline-block rounded-full border px-3 py-1 text-sm font-bold {pointColor(grade.cardiacMarkerPoint)}">
			{grade.cardiacMarkerPoint} point {grade.cardiacMarkerPoint === 1 ? '(positive)' : '(negative)'}
		</span>
	</Field>
</Fieldset>
