<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { calculateChildPughGrade } from '#lib/engine/child-pugh-grader.js';
	import {
		childPughClassColor,
		childPughClassLabel,
		surgicalRiskLabel,
		formatScore
	} from '#lib/engine/utils.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const n = assessment.data.note;
	const grade = $derived(calculateChildPughGrade(assessment.data));
</script>

<Fieldset legend="Step 8 of 8 — Summary and score">
	<p class="hint">
		Live Child-Pugh total, class, prognosis, and a free-text clinical note. Submit to generate the
		full report.
	</p>

	<Field label="Live Child-Pugh score">
		<span class="inline-flex flex-wrap items-center gap-3">
			<strong class="text-lg text-base-content"
				>{formatScore(grade.childPughScore, grade.complete)}</strong
			>
			<span
				class="inline-block rounded-full border px-3 py-1 text-sm font-bold {childPughClassColor(
					grade.childPughClass
				)}"
			>
				{childPughClassLabel(grade.childPughClass)}
			</span>
			<span class="text-sm text-base-content/70">
				~1-year survival {grade.oneYearSurvival} · peri-operative risk {surgicalRiskLabel(
					grade.surgicalRisk
				)}
			</span>
		</span>
	</Field>

	{#if !grade.complete}
		<p class="hint">
			The score is provisional — a Child-Pugh total is only valid once all five parameters have been
			answered.
		</p>
	{/if}

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
