<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateFourATGrade } from '$lib/engine/fourat-grader';
	import { pointColor } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const i = assessment.data.item2;
	const point = $derived(calculateFourATGrade(assessment.data).item2Score);
	const options = [
		{ value: 'noMistakes', label: 'No mistakes' },
		{ value: 'oneMistake', label: '1 mistake' },
		{ value: 'twoOrMoreOrUntestable', label: '2 or more mistakes, or untestable' }
	];
</script>

<Fieldset legend="Step 3 of 6 — Item 2: AMT4">
	<p class="hint">
		Abbreviated Mental Test — 4 items: age, date of birth, place (name of the hospital or
		building), and current year. 1 mistake scores 1 point; 2 or more mistakes, or untestable,
		scores 2 points.
	</p>

	<Field label="AMT4 mistakes across age, date of birth, place, and current year">
		<RadioGroup label="AMT4 mistakes">
			{#each options as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="item2-amt4"
						value={opt.value}
						bind:group={i.amt4}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Item 2 score">
		<span class="inline-block rounded-full border px-3 py-1 text-sm font-bold {pointColor(point)}">
			{point} of 2
		</span>
	</Field>
</Fieldset>
