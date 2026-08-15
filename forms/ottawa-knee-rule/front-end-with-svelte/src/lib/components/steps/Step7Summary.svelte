<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { gradeOttawaKnee } from '#lib/engine/ottawa-knee-grader.js';
	import { decisionLabel, decisionColor } from '#lib/engine/utils.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const n = assessment.data.note;
	const grade = $derived(gradeOttawaKnee(assessment.data));
	const firedCount = $derived(
		grade.firedCriteria.filter((r) => r.criterion !== 'decision').length
	);
</script>

<Fieldset legend="Step 7 of 7 — Summary and decision">
	<p class="hint">
		Live imaging decision (ANY-of the five criteria) and a free-text clinical note. Submit to
		generate the full report.
	</p>

	<Field label="Live imaging decision">
		<span class="inline-flex flex-wrap items-center gap-3">
			<span
				class="inline-block rounded-full border px-3 py-1 text-sm font-bold {decisionColor(grade.decision)}"
			>
				{decisionLabel(grade.decision)}
			</span>
			<span class="text-sm text-base-content/70">
				{firedCount} of 5 criteria present
			</span>
		</span>
	</Field>

	<Field label="Clinical note" inputId="note-clinicalNotes">
		<TextAreaInput
			id="note-clinicalNotes"
			label="Clinical note"
			rows={4}
			placeholder="Free-text clinical note: context, decisions, and any imaging or safety-netting already actioned."
			bind:value={n.clinicalNotes}
		/>
	</Field>
</Fieldset>
