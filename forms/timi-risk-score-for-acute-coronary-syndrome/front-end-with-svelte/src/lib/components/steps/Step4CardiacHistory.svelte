<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { calculateTimiGrade } from '#lib/engine/timi-grader.js';
	import { pointColor } from '#lib/engine/utils.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const h = assessment.data.cardiacHistory;
	const grade = $derived(calculateTimiGrade(assessment.data));
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Step 4 of 7 — Cardiac history and medication">
	<p class="hint">Criteria 3 and 4 — each scores 1 point when present.</p>

	<Field
		label="Known coronary artery disease (prior stenosis &ge; 50%)?"
		description="Criterion 3 — documented prior coronary stenosis of 50% or more on angiography."
	>
		<RadioGroup label="Known coronary artery disease (prior stenosis of 50% or more)?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="cardiacHistory-knownCadStenosis"
						value={opt.value}
						bind:group={h.knownCadStenosis}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Criterion 3 point">
		<span class="inline-block rounded-full border px-3 py-1 text-sm font-bold {pointColor(grade.knownCadPoint)}">
			{grade.knownCadPoint} point {grade.knownCadPoint === 1 ? '(positive)' : '(negative)'}
		</span>
	</Field>

	<Field
		label="Aspirin use in the prior 7 days?"
		description="Criterion 4 — the patient took aspirin within the last 7 days."
	>
		<RadioGroup label="Aspirin use in the prior 7 days?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="cardiacHistory-aspirinUsePrior7Days"
						value={opt.value}
						bind:group={h.aspirinUsePrior7Days}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Criterion 4 point">
		<span class="inline-block rounded-full border px-3 py-1 text-sm font-bold {pointColor(grade.aspirinPoint)}">
			{grade.aspirinPoint} point {grade.aspirinPoint === 1 ? '(positive)' : '(negative)'}
		</span>
	</Field>
</Fieldset>
