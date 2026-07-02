<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateGbsGrade } from '$lib/engine/gbs-grader';
	import { riskBandColor, riskBandLabel, formatScore } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const n = assessment.data.note;
	const grade = $derived(calculateGbsGrade(assessment.data));
</script>

<Fieldset legend="Step 6 of 6 — Summary and score">
	<p class="hint">
		Live Glasgow-Blatchford total, derived risk band, and a free-text clinical note. Submit to
		generate the full report.
	</p>

	<Field label="Live Glasgow-Blatchford score">
		<span class="inline-flex flex-wrap items-center gap-3">
			<strong class="text-lg text-base-content">{formatScore(grade.gbsScore, grade.complete)}</strong>
			<span
				class="inline-block rounded-full border px-3 py-1 text-sm font-bold {riskBandColor(
					grade.riskBand
				)}"
			>
				{riskBandLabel(grade.riskBand)}
			</span>
			<span class="text-sm text-base-content/70">out of 23</span>
		</span>
	</Field>

	{#if !grade.complete}
		<p class="hint">
			The score is provisional — a Glasgow-Blatchford total is only valid once all eight parameters
			and the patient's sex have been answered.
		</p>
	{/if}

	<Field label="Clinical note" inputId="note-clinicalNote">
		<TextAreaInput
			id="note-clinicalNote"
			label="Clinical note"
			rows={4}
			placeholder="Free-text clinical note: resuscitation actioned, endoscopy plan, disposition decision, and any escalation already made."
			bind:value={n.clinicalNote}
		/>
	</Field>
</Fieldset>
