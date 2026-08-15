<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { calculateGrade } from '#lib/engine/cervical-screening-grader.js';
	import {
		managementActionLabel,
		resultClassColor,
		resultClassLabel,
		statusLabel
	} from '#lib/engine/utils.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const n = assessment.data.note;
	const grade = $derived(calculateGrade(assessment.data));
</script>

<Fieldset legend="Step 9 of 9 — Clinical note and result">
	<p class="hint">
		Live result classification and management action, plus a free-text clinical note. Submit to
		generate the full report.
	</p>

	<Field label="Live result classification">
		<span class="inline-flex flex-wrap items-center gap-3">
			<span
				class="inline-block rounded-full border px-3 py-1 text-sm font-bold {resultClassColor(
					grade.resultClass
				)}"
			>
				{resultClassLabel(grade.resultClass)}
			</span>
			<span class="text-sm text-base-content/70">
				{managementActionLabel(grade.managementAction)} · {statusLabel(grade.status)}
			</span>
		</span>
	</Field>

	<Field label="Clinical note" inputId="note-clinicalContext">
		<TextAreaInput
			id="note-clinicalContext"
			label="Clinical note"
			rows={4}
			placeholder="Free-text clinical note: context, decisions, and any referral already actioned."
			bind:value={n.clinicalContext}
		/>
	</Field>
</Fieldset>
