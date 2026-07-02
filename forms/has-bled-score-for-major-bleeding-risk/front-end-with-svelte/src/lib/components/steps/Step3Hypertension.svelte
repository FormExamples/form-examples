<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateHasBledGrade } from '$lib/engine/hasbled-grader';
	import { pointColor } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const h = assessment.data.hypertension;
	const point = $derived(calculateHasBledGrade(assessment.data).hypertensionPoint);
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Step 3 of 9 — Hypertension (H)">
	<p class="hint">
		Criterion H — scores 1 point for uncontrolled hypertension, taken as systolic blood pressure
		&gt; 160 mmHg.
	</p>

	<Field label="Is hypertension uncontrolled (systolic BP &gt; 160 mmHg)?">
		<RadioGroup label="Is hypertension uncontrolled (systolic BP over 160 mmHg)?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="hypertension-hypertensionUncontrolled"
						value={opt.value}
						bind:group={h.hypertensionUncontrolled}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Criterion H point">
		<span class="inline-block rounded-full border px-3 py-1 text-sm font-bold {pointColor(point)}">
			{point} point {point === 1 ? '(positive)' : '(negative)'}
		</span>
	</Field>
</Fieldset>
