<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { calculateQsofaGrade } from '#lib/engine/qsofa-grader.js';
	import { pointColor } from '#lib/engine/utils.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const m = assessment.data.mentation;
	const point = $derived(calculateQsofaGrade(assessment.data).mentationPoint);
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Step 4 of 6 — Mentation">
	<p class="hint">
		Criterion 2 — scores 1 point when the Glasgow Coma Scale is below 15, or mentation is altered
		from baseline.
	</p>

	<Field
		label="Glasgow Coma Scale total"
		description="GCS 3-15. Positive (1 point) when < 15. Leave blank if a formal GCS was not measured."
		inputId="mentation-glasgowComaScale"
	>
		<NumberInput
			id="mentation-glasgowComaScale"
			label="Glasgow Coma Scale total"
			min={3}
			max={15}
			step={1}
			bind:value={m.glasgowComaScale}
		/>
	</Field>

	<Field label="Is mentation altered from the patient's baseline?">
		<RadioGroup label="Is mentation altered from the patient's baseline?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="mentation-mentationAltered"
						value={opt.value}
						bind:group={m.mentationAltered}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Criterion 2 point">
		<span class="inline-block rounded-full border px-3 py-1 text-sm font-bold {pointColor(point)}">
			{point} point {point === 1 ? '(positive)' : '(negative)'}
		</span>
	</Field>
</Fieldset>
