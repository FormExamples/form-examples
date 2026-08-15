<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { calculateCurb65Grade } from '#lib/engine/curb65-grader.js';
	import { pointColor } from '#lib/engine/utils.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const c = assessment.data.confusion;
	const point = $derived(calculateCurb65Grade(assessment.data).confusionScore);
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Step 3 of 9 — Confusion (C)">
	<p class="hint">
		Criterion C — scores 1 point when new-onset confusion is present (AMT &le; 8, or new
		disorientation in person, place, or time).
	</p>

	<Field label="Is new-onset confusion present?">
		<RadioGroup label="Is new-onset confusion present?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="confusion-confusionPresent"
						value={opt.value}
						bind:group={c.confusionPresent}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field
		label="Abbreviated Mental Test (AMT) score"
		description="Supporting evidence (0-10); not scored directly. Leave blank if not measured."
		inputId="confusion-amtScore"
	>
		<NumberInput
			id="confusion-amtScore"
			label="Abbreviated Mental Test (AMT) score"
			min={0}
			max={10}
			step={1}
			bind:value={c.amtScore}
		/>
	</Field>

	<Field label="Criterion C point">
		<span class="inline-block rounded-full border px-3 py-1 text-sm font-bold {pointColor(point)}">
			{point} point {point === 1 ? '(positive)' : '(negative)'}
		</span>
	</Field>
</Fieldset>
