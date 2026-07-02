<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateGraceGrade } from '$lib/engine/grace-grader';
	import { riskCategoryLabel, riskCategoryColor } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const n = assessment.data.note;
	const grade = $derived(calculateGraceGrade(assessment.data));
</script>

<Fieldset legend="Step 7 of 7 — Summary and score">
	<p class="hint">
		Live GRACE total and a free-text clinical note. Submit to generate the full report.
	</p>

	<Field label="Live GRACE score">
		<span class="inline-flex items-center gap-3">
			<strong class="text-lg text-base-content">{grade.gracePoints} points</strong>
			<span
				class="inline-block rounded-full border px-3 py-1 text-sm font-bold {riskCategoryColor(
					grade.riskCategory
				)}"
			>
				{riskCategoryLabel(grade.riskCategory)}
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
