<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateCurb65Grade } from '$lib/engine/curb65-grader';
	import { pointColor } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const u = assessment.data.urea;
	const grade = $derived(calculateCurb65Grade(assessment.data));
	const point = $derived(grade.ureaScore);
	const measured = $derived(u.ureaMeasured === 'yes');
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Step 4 of 9 — Urea (U)">
	<p class="hint">
		Criterion U — scores 1 point when serum urea is &gt; 7 mmol/L. When urea was not measured, the
		four-criterion CRB-65 variant is used instead.
	</p>

	<Field label="Was serum urea measured?">
		<RadioGroup label="Was serum urea measured?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="urea-ureaMeasured"
						value={opt.value}
						bind:group={u.ureaMeasured}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field
		label="Serum urea (mmol/L)"
		description="Positive (1 point) when > 7 mmol/L (blood urea nitrogen > 19 mg/dL)."
		inputId="urea-ureaMmolL"
	>
		<NumberInput
			id="urea-ureaMmolL"
			label="Serum urea (mmol/L)"
			min={0}
			max={100}
			step={0.1}
			bind:value={u.ureaMmolL}
		/>
	</Field>

	<Field label="Criterion U point">
		{#if measured}
			<span class="inline-block rounded-full border px-3 py-1 text-sm font-bold {pointColor(point)}">
				{point} point {point === 1 ? '(positive)' : '(negative)'}
			</span>
		{:else}
			<span
				class="inline-block rounded-full border px-3 py-1 text-sm font-bold bg-base-300 text-base-content border-base-300"
			>
				Not scored — CRB-65 pathway
			</span>
		{/if}
	</Field>
</Fieldset>
