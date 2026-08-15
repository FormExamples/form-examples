<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { calculateCapriniGrade } from '#lib/engine/caprini-grader.js';
	import { riskBandLabel, riskBandColor, recommendedProphylaxisLabel } from '#lib/engine/utils.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const n = assessment.data.note;
	const grade = $derived(calculateCapriniGrade(assessment.data));
</script>

<Fieldset legend="Step 8 of 8 — Summary and score">
	<p class="hint">
		Live Caprini total, recommended prophylaxis, and a free-text clinical note. Submit to generate
		the full report.
	</p>

	<Field label="Live Caprini score">
		<span class="inline-flex flex-wrap items-center gap-3">
			<strong class="text-lg text-base-content">{grade.capriniScore}</strong>
			<span
				class="inline-block rounded-full border px-3 py-1 text-sm font-bold {riskBandColor(grade.riskBand)}"
			>
				{riskBandLabel(grade.riskBand)}
			</span>
		</span>
	</Field>

	<Field label="Recommended prophylaxis">
		<p class="text-sm text-base-content/80">
			{recommendedProphylaxisLabel(grade.recommendedProphylaxis)}
			{#if grade.bleedingDowngraded}
				<span class="mt-1 block font-semibold text-error">
					Downgraded from pharmacological to mechanical because of a high bleeding risk.
				</span>
			{/if}
		</p>
	</Field>

	<Field label="Clinical note" inputId="note-clinicalNote">
		<TextAreaInput
			id="note-clinicalNote"
			label="Clinical note"
			rows={4}
			placeholder="Free-text clinical note: context, prophylaxis decision, and any escalation already actioned."
			bind:value={n.clinicalNote}
		/>
	</Field>
</Fieldset>
