<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateHasBledGrade } from '$lib/engine/hasbled-grader';
	import { pointColor } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const l = assessment.data.labileInr;
	const point = $derived(calculateHasBledGrade(assessment.data).labileInrPoint);
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Step 7 of 9 — Labile INR (L)">
	<p class="hint">
		Criterion L — for patients on warfarin, scores 1 point for unstable or high INRs, or time in
		therapeutic range &lt; 60%. Score No if the patient is not on a vitamin-K antagonist.
	</p>

	<Field label="Labile INR (unstable/high INR, or time in therapeutic range &lt; 60%)?">
		<RadioGroup label="Labile INR?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="labileInr-labileInr"
						value={opt.value}
						bind:group={l.labileInr}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Criterion L point">
		<span class="inline-block rounded-full border px-3 py-1 text-sm font-bold {pointColor(point)}">
			{point} point {point === 1 ? '(positive)' : '(negative)'}
		</span>
	</Field>
</Fieldset>
