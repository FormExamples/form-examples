<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { calculateCageGrade } from '#lib/engine/cage-grader.js';
	import { pointColor } from '#lib/engine/utils.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const c = assessment.data.criteria;
	const point = $derived(calculateCageGrade(assessment.data).guiltyPoint);
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Step 5 of 7 — Guilty (G)">
	<p class="hint">
		Criterion G — scores 1 point for a "yes". A lifetime question about the person's drinking.
	</p>

	<Field label="Have you ever felt bad or guilty about your drinking?">
		<RadioGroup label="Have you ever felt bad or guilty about your drinking?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="criteria-guilty"
						value={opt.value}
						bind:group={c.guilty}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Criterion G point">
		<span class="inline-block rounded-full border px-3 py-1 text-sm font-bold {pointColor(point)}">
			{point} point {point === 1 ? '(positive)' : '(negative)'}
		</span>
	</Field>
</Fieldset>
