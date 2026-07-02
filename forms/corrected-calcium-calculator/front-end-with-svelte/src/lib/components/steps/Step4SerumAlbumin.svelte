<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateCorrectedCalcium } from '$lib/engine/calcium-calculator';
	import { classificationColor, classificationLabel, formatCalcium } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';

	const a = assessment.data.albumin;
	const grade = $derived(calculateCorrectedCalcium(assessment.data));
</script>

<Fieldset legend="Step 4 of 6 — Serum albumin">
	<p class="hint">
		Calculation input 2 — the measured serum albumin in g/L. Results are corrected to a reference
		albumin of 40 g/L: correctedCalcium = totalCalcium + 0.02 × (40 − albumin).
	</p>

	<Field
		label="Measured serum albumin (g/L)"
		description="Adult serum-albumin results are typically around 35-50 g/L."
		inputId="albumin-albumin"
	>
		<NumberInput
			id="albumin-albumin"
			label="Measured serum albumin"
			min={0}
			max={100}
			step={1}
			bind:value={a.albumin}
		/>
	</Field>

	<Field label="Live corrected calcium">
		<span class="inline-flex items-center gap-3">
			<strong class="text-lg text-base-content">{formatCalcium(grade.correctedCalcium)}</strong>
			<span
				class="inline-block rounded-full border px-3 py-1 text-sm font-bold {classificationColor(
					grade.classification
				)}"
			>
				{classificationLabel(grade.classification)}
			</span>
		</span>
	</Field>
</Fieldset>
