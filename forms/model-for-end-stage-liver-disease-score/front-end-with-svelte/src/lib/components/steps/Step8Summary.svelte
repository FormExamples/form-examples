<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { calculateMeld } from '#lib/engine/meld-grader.js';
	import { mortalityBandColor, mortalityBandLabel, formatScore } from '#lib/engine/utils.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const n = assessment.data.note;
	const grade = $derived(calculateMeld(assessment.data));
</script>

<Fieldset legend="Step 8 of 8 — Summary and result">
	<p class="hint">
		Live MELD score, mortality band, and a free-text clinical note. Submit to generate the full
		report.
	</p>

	<Field label="Live MELD score">
		<span class="inline-flex items-center gap-3">
			<strong class="text-lg text-base-content">{formatScore(grade.meldScore)}</strong>
			<span
				class="inline-block rounded-full border px-3 py-1 text-sm font-bold {mortalityBandColor(
					grade.mortalityBand
				)}"
			>
				{mortalityBandLabel(grade.mortalityBand)}
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
