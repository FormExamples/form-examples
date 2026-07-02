<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculatePercGrade } from '$lib/engine/perc-grader';
	import { classificationLabel, classificationColor } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const r = assessment.data.result;
	const grade = $derived(calculatePercGrade(assessment.data));
</script>

<Fieldset legend="Step 6 of 6 — Summary and result">
	<p class="hint">
		The live PERC classification updates below. Add a free-text clinical note and submit to
		generate the full report. This is a status form — there is no numeric score.
	</p>

	<Field label="Live PERC classification">
		<span class="inline-flex flex-wrap items-center gap-3">
			<span
				class="inline-block rounded-full border px-3 py-1 text-sm font-bold {classificationColor(
					grade.classification
				)}"
			>
				{classificationLabel(grade.classification)}
			</span>
			<span class="text-sm text-base-content/70">
				{grade.classification === 'perc-negative'
					? 'Pre-test probability low and all eight criteria satisfied.'
					: grade.failedCriteria.length
						? `Failed criteria: ${grade.failedCriteria.join(', ')}${grade.applicable ? '' : ' (pre-test probability not low)'}`
						: 'Pre-test probability not low — PERC does not apply.'}
			</span>
		</span>
	</Field>

	<Field label="Clinical note" inputId="result-clinicalNote">
		<TextAreaInput
			id="result-clinicalNote"
			label="Clinical note"
			rows={4}
			placeholder="Free-text clinical note: context, decision, and any workup already actioned."
			bind:value={r.clinicalNote}
		/>
	</Field>
</Fieldset>
