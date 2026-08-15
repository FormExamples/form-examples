<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { calculateFourATGrade } from '#lib/engine/fourat-grader.js';
	import { pointColor } from '#lib/engine/utils.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const i = assessment.data.item3;
	const point = $derived(calculateFourATGrade(assessment.data).item3Score);
	const options = [
		{ value: 'sevenOrMore', label: 'Achieves 7 or more months correctly' },
		{ value: 'startsButUnderSevenOrRefuses', label: 'Starts but scores under 7 months, or refuses to start' },
		{ value: 'untestable', label: 'Untestable — cannot start (unwell, drowsy, or inattentive)' }
	];
</script>

<Fieldset legend="Step 4 of 6 — Item 3: Attention">
	<p class="hint">
		Ask the patient to tell you the months of the year in backwards order, starting at December.
		Fewer than 7 months, or refusal, scores 1 point; untestable scores 2 points.
	</p>

	<Field label="Months of the year backwards">
		<RadioGroup label="Months of the year backwards">
			{#each options as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="item3-attentionMonths"
						value={opt.value}
						bind:group={i.attentionMonths}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Item 3 score">
		<span class="inline-block rounded-full border px-3 py-1 text-sm font-bold {pointColor(point)}">
			{point} of 2
		</span>
	</Field>
</Fieldset>
