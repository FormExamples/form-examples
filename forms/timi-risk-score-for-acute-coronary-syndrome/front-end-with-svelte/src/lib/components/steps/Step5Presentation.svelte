<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { calculateTimiGrade } from '#lib/engine/timi-grader.js';
	import { pointColor } from '#lib/engine/utils.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const p = assessment.data.presentation;
	const grade = $derived(calculateTimiGrade(assessment.data));
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Step 5 of 7 — Presentation">
	<p class="hint">Criterion 5 — scores 1 point when present.</p>

	<Field
		label="At least two anginal episodes in the prior 24 hours?"
		description="Criterion 5 — severe recent angina (&ge; 2 episodes in 24 h)."
	>
		<RadioGroup label="At least two anginal episodes in the prior 24 hours?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="presentation-twoOrMoreAnginaEpisodes24h"
						value={opt.value}
						bind:group={p.twoOrMoreAnginaEpisodes24h}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Criterion 5 point">
		<span class="inline-block rounded-full border px-3 py-1 text-sm font-bold {pointColor(grade.anginaPoint)}">
			{grade.anginaPoint} point {grade.anginaPoint === 1 ? '(positive)' : '(negative)'}
		</span>
	</Field>
</Fieldset>
