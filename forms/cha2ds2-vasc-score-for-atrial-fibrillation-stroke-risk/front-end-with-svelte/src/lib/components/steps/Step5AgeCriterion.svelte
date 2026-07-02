<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateCha2ds2VascGrade } from '$lib/engine/cha2ds2vasc-grader';
	import { ageBandLabel, pointColor } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';

	const grade = $derived(calculateCha2ds2VascGrade(assessment.data));
	const ageYears = $derived(assessment.data.identification.ageYears);
	const band = $derived(ageBandLabel(ageYears));
</script>

<Fieldset legend="Step 5 of 6 — Age criterion">
	<p class="hint">
		Criterion A — derived from the age entered in Step 2: age &ge; 75 scores 2, age 65&ndash;74
		scores 1, under 65 scores 0. The bands are mutually exclusive.
	</p>

	<Field label="Derived age band">
		{#if ageYears === null}
			<span class="text-sm text-base-content/60">Enter age in Step 2 to derive the band.</span>
		{:else}
			<strong class="text-base-content">{band}</strong>
		{/if}
	</Field>

	<Field label="Age criterion point (A)">
		<span class="inline-block rounded-full border px-3 py-1 text-sm font-bold {pointColor(grade.agePoint)}">
			{grade.agePoint} {grade.agePoint === 1 ? 'point' : 'points'}
		</span>
	</Field>
</Fieldset>
