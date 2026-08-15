<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { calculateAnionGap } from '#lib/engine/anion-gap-grader.js';
	import { classificationColor, classificationLabel, formatGap } from '#lib/engine/utils.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';

	const a = assessment.data.albumin;
	const grade = $derived(calculateAnionGap(assessment.data));
</script>

<Fieldset legend="Step 4 of 5 — Serum albumin">
	<p class="hint">
		Optional. Entering a serum albumin (g/L) enables the albumin correction, which restores the gap
		hidden by hypoalbuminaemia: correctedAnionGap = anionGap + 0.25 × (40 − albumin).
	</p>

	<Field
		label="Serum albumin (g/L) — optional"
		description="Adult serum-albumin results are typically around 35-50 g/L."
		inputId="albumin-albumin"
	>
		<NumberInput
			id="albumin-albumin"
			label="Serum albumin"
			min={0}
			max={100}
			step={1}
			bind:value={a.albumin}
		/>
	</Field>

	<Field label="Live anion gap">
		<span class="inline-flex flex-wrap items-center gap-3">
			<strong class="text-lg text-base-content">{formatGap(grade.anionGap)}</strong>
			{#if grade.correctedAnionGap !== null}
				<span class="text-sm text-base-content/70"
					>corrected {formatGap(grade.correctedAnionGap)}</span
				>
			{/if}
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
