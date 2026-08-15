<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { calculateHasBledGrade } from '#lib/engine/hasbled-grader.js';
	import { pointColor } from '#lib/engine/utils.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const o = assessment.data.organFunction;
	const grade = $derived(calculateHasBledGrade(assessment.data));
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Step 4 of 9 — Renal and liver function (A, A)">
	<p class="hint">
		Two independent criteria. Abnormal renal function is dialysis, transplant, or serum creatinine
		&ge; 200 &micro;mol/L. Abnormal liver function is cirrhosis, or bilirubin &gt; 2&times; the upper
		limit of normal with transaminases &gt; 3&times; the upper limit.
	</p>

	<Field label="Abnormal renal function (dialysis, transplant, or creatinine &ge; 200 &micro;mol/L)?">
		<RadioGroup label="Abnormal renal function?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="organFunction-abnormalRenalFunction"
						value={opt.value}
						bind:group={o.abnormalRenalFunction}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Abnormal renal (A) point">
		<span
			class="inline-block rounded-full border px-3 py-1 text-sm font-bold {pointColor(
				grade.renalPoint
			)}"
		>
			{grade.renalPoint} point {grade.renalPoint === 1 ? '(positive)' : '(negative)'}
		</span>
	</Field>

	<Field label="Abnormal liver function (cirrhosis, or bilirubin &gt; 2&times; ULN with transaminases &gt; 3&times; ULN)?">
		<RadioGroup label="Abnormal liver function?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="organFunction-abnormalLiverFunction"
						value={opt.value}
						bind:group={o.abnormalLiverFunction}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Abnormal liver (A) point">
		<span
			class="inline-block rounded-full border px-3 py-1 text-sm font-bold {pointColor(
				grade.liverPoint
			)}"
		>
			{grade.liverPoint} point {grade.liverPoint === 1 ? '(positive)' : '(negative)'}
		</span>
	</Field>
</Fieldset>
