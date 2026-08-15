<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { calculateRockallGrade } from '#lib/engine/rockall-grader.js';
	import { riskBandColor, riskBandLabel, formatScore } from '#lib/engine/utils.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const n = assessment.data.note;
	const grade = $derived(calculateRockallGrade(assessment.data));
</script>

<Fieldset legend="Step 6 of 6 — Summary and score">
	<p class="hint">
		Live Rockall score, risk band, and a free-text clinical note. Submit to generate the full report.
	</p>

	<Field label="Live Rockall score">
		<span class="inline-flex flex-wrap items-center gap-3">
			<strong class="text-lg text-base-content">{formatScore(grade)}</strong>
			<span
				class="inline-block rounded-full border px-3 py-1 text-sm font-bold {riskBandColor(
					grade.riskBand
				)}"
			>
				{riskBandLabel(grade.riskBand)}
			</span>
			<span class="text-sm text-base-content/70">
				Clinical component {grade.clinicalRockallScore} of 7
			</span>
		</span>
	</Field>

	{#if !grade.endoscopyDone}
		<p class="hint">
			Endoscopy has not been performed, so only the pre-endoscopy (clinical) score is reported. The
			full score of 11 becomes available once endoscopy is recorded.
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
