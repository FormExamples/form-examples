<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { calculateCorrectedCalcium } from '#lib/engine/calcium-calculator.js';
	import { classificationColor, classificationLabel, formatCalcium } from '#lib/engine/utils.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const n = assessment.data.note;
	const grade = $derived(calculateCorrectedCalcium(assessment.data));
</script>

<Fieldset legend="Step 6 of 6 — Summary and result">
	<p class="hint">
		Live corrected calcium, classification, and a free-text clinical note. Submit to generate the
		full report.
	</p>

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

	<Field label="Clinical note" inputId="note-clinicalNote">
		<TextAreaInput
			id="note-clinicalNote"
			label="Clinical note"
			rows={4}
			placeholder="Free-text clinical note: context, decisions, and any escalation already actioned."
			bind:value={n.clinicalNote}
		/>
	</Field>
</Fieldset>
