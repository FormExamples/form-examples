<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateCageGrade } from '$lib/engine/cage-grader';
	import { resultBandLabel, resultBandColor } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const n = assessment.data.note;
	const grade = $derived(calculateCageGrade(assessment.data));
</script>

<Fieldset legend="Step 7 of 7 — Summary and score">
	<p class="hint">
		Live CAGE total and a free-text clinical note. Submit to generate the full report.
	</p>

	<Field label="Live CAGE score">
		<span class="inline-flex items-center gap-3">
			<strong class="text-lg text-base-content">{grade.cageScore} of 4</strong>
			<span
				class="inline-block rounded-full border px-3 py-1 text-sm font-bold {resultBandColor(grade.resultBand)}"
			>
				{resultBandLabel(grade.resultBand)}
			</span>
		</span>
	</Field>

	<Field label="Clinical note" inputId="note-clinicalNote">
		<TextAreaInput
			id="note-clinicalNote"
			label="Clinical note"
			rows={4}
			placeholder="Free-text clinical note: context, decisions, and any onward referral already actioned."
			bind:value={n.clinicalNote}
		/>
	</Field>
</Fieldset>
