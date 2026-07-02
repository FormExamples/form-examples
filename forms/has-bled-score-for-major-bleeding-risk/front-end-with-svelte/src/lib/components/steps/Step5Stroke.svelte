<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateHasBledGrade } from '$lib/engine/hasbled-grader';
	import { pointColor } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const s = assessment.data.stroke;
	const point = $derived(calculateHasBledGrade(assessment.data).strokePoint);
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Step 5 of 9 — Stroke history (S)">
	<p class="hint">Criterion S — scores 1 point for a previous stroke.</p>

	<Field label="Previous stroke?">
		<RadioGroup label="Previous stroke?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="stroke-strokeHistory"
						value={opt.value}
						bind:group={s.strokeHistory}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Criterion S point">
		<span class="inline-block rounded-full border px-3 py-1 text-sm font-bold {pointColor(point)}">
			{point} point {point === 1 ? '(positive)' : '(negative)'}
		</span>
	</Field>
</Fieldset>
