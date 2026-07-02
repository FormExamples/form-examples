<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateCageGrade } from '$lib/engine/cage-grader';
	import { pointColor } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const c = assessment.data.criteria;
	const point = $derived(calculateCageGrade(assessment.data).cutDownPoint);
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Step 3 of 7 — Cut down (C)">
	<p class="hint">
		Criterion C — scores 1 point for a "yes". A lifetime question about the person's drinking.
	</p>

	<Field label="Have you ever felt you should cut down on your drinking?">
		<RadioGroup label="Have you ever felt you should cut down on your drinking?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="criteria-cutDown"
						value={opt.value}
						bind:group={c.cutDown}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Criterion C point">
		<span class="inline-block rounded-full border px-3 py-1 text-sm font-bold {pointColor(point)}">
			{point} point {point === 1 ? '(positive)' : '(negative)'}
		</span>
	</Field>
</Fieldset>
