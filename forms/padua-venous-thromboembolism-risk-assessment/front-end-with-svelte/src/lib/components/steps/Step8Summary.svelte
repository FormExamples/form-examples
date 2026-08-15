<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { calculatePaduaGrade } from '#lib/engine/padua-grader.js';
	import { riskBandLabel, riskBandColor, prophylaxisLabel } from '#lib/engine/utils.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const n = assessment.data.note;
	const grade = $derived(calculatePaduaGrade(assessment.data));
</script>

<Fieldset legend="Step 8 of 8 — Summary and score">
	<p class="hint">
		Live Padua total, risk band, prophylaxis recommendation, and a free-text clinical note. Submit
		to generate the full report.
	</p>

	<Field label="Live Padua score">
		<span class="inline-flex flex-wrap items-center gap-3">
			<strong class="text-lg text-base-content">{grade.paduaScore} of 20</strong>
			<span
				class="inline-block rounded-full border px-3 py-1 text-sm font-bold {riskBandColor(grade.riskBand)}"
			>
				{riskBandLabel(grade.riskBand)}
			</span>
			<span class="text-sm text-base-content/70">
				{prophylaxisLabel(grade.prophylaxisRecommendation)}
			</span>
		</span>
	</Field>

	<Field label="Clinical note" inputId="note-clinicalNote">
		<TextAreaInput
			id="note-clinicalNote"
			label="Clinical note"
			rows={4}
			placeholder="Free-text clinical note: context, prophylaxis decision, and any bleeding-risk considerations."
			bind:value={n.clinicalNote}
		/>
	</Field>
</Fieldset>
