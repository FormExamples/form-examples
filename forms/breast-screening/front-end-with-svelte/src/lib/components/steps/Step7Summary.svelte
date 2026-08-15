<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { calculateGrade } from '#lib/engine/breast-screening-grader.js';
	import {
		eligibilityLabel,
		outcomeBandColor,
		outcomeBandLabel,
		screeningOutcomeLabel
	} from '#lib/engine/utils.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const n = assessment.data.note;
	const grade = $derived(calculateGrade(assessment.data));
</script>

<Fieldset legend="Step 7 of 7 — Summary and outcome">
	<p class="hint">
		Live screening outcome and a free-text clinical note. Submit to generate the full report. This
		is a classification form — there is no numeric score.
	</p>

	<Field label="Live screening outcome">
		<span class="inline-flex flex-wrap items-center gap-3">
			<span
				class="inline-block rounded-full border px-3 py-1 text-sm font-bold {outcomeBandColor(
					grade.outcomeBand
				)}"
			>
				{outcomeBandLabel(grade.outcomeBand)}
			</span>
			<span class="text-sm font-semibold text-base-content">
				{screeningOutcomeLabel(grade.screeningOutcome)}
			</span>
			{#if eligibilityLabel(grade.eligibilityStatus)}
				<span class="text-sm text-base-content/70">· {eligibilityLabel(grade.eligibilityStatus)}</span>
			{/if}
		</span>
	</Field>

	<Field label="Clinical context" inputId="note-clinicalContext">
		<TextAreaInput
			id="note-clinicalContext"
			label="Clinical context"
			rows={4}
			placeholder="Free-text clinical context: decisions, discussions, and any onward referral already actioned."
			bind:value={n.clinicalContext}
		/>
	</Field>
</Fieldset>
