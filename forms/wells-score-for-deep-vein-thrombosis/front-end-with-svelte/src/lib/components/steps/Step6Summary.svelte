<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateWellsGrade } from '$lib/engine/wells-dvt-grader';
	import {
		twoLevelBandLabel,
		twoLevelBandColor,
		threeLevelBandLabel,
		threeLevelBandColor,
		recommendedInvestigationLabel
	} from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const n = assessment.data.note;
	const grade = $derived(calculateWellsGrade(assessment.data));
</script>

<Fieldset legend="Step 6 of 6 — Summary and score">
	<p class="hint">
		Live Wells total, bands, and a free-text clinical note. Submit to generate the full report.
	</p>

	<Field label="Live Wells score">
		<span class="inline-flex flex-wrap items-center gap-3">
			<strong class="text-lg text-base-content">{grade.wellsScore}</strong>
			<span
				class="inline-block rounded-full border px-3 py-1 text-sm font-bold {twoLevelBandColor(grade.twoLevelBand)}"
			>
				{twoLevelBandLabel(grade.twoLevelBand)}
			</span>
			<span
				class="inline-block rounded-full border px-3 py-1 text-sm font-bold {threeLevelBandColor(grade.threeLevelBand)}"
			>
				{threeLevelBandLabel(grade.threeLevelBand)}
			</span>
		</span>
	</Field>

	<Field label="Recommended first investigation">
		<span class="text-base-content">{recommendedInvestigationLabel(grade.recommendedInvestigation)}</span>
	</Field>

	<Field label="Clinical note" inputId="note-clinicalNotes">
		<TextAreaInput
			id="note-clinicalNotes"
			label="Clinical note"
			rows={4}
			placeholder="Free-text clinical note: context, decisions, and any investigation or anticoagulation already actioned."
			bind:value={n.clinicalNotes}
		/>
	</Field>
</Fieldset>
