<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { calculateGrade } from '#lib/engine/podiatry-grader.js';
	import { riskColor, riskLabel, referralLabel, reviewIntervalLabel, reviewPathwayLabel, statusLabel } from '#lib/engine/utils.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const n = assessment.data.note;
	const grade = $derived(calculateGrade(assessment.data));
</script>

<Fieldset legend="Step 5 of 5 — Summary and outcome">
	<p class="hint">
		Live per-foot and overall risk classification, review pathway, and a free-text assessor note.
		Submit to generate the full report. This is a risk-stratification classification, not a
		numeric score.
	</p>

	<Field label="Live outcome">
		<span class="inline-flex flex-wrap items-center gap-3">
			<span
				class="inline-block rounded-full border px-3 py-1 text-sm font-bold {riskColor(grade.overallRisk)}"
			>
				{riskLabel(grade.overallRisk)}
			</span>
			<span class="text-sm text-base-content/70">
				{reviewPathwayLabel(grade.reviewPathway)} · {referralLabel(grade.referral)} · {reviewIntervalLabel(
					grade.reviewIntervalMonths
				)} · {statusLabel(grade.status)}
			</span>
		</span>
	</Field>

	<Field label="Per-foot risk">
		<span class="text-sm text-base-content/70">
			Right: {riskLabel(grade.rightFootRisk)} · Left: {riskLabel(grade.leftFootRisk)}
		</span>
	</Field>

	<Field label="Clinical note" inputId="note-clinicalContext">
		<TextAreaInput
			id="note-clinicalContext"
			label="Clinical note"
			rows={4}
			placeholder="Free-text clinical context: decisions, support in place, and any referral already actioned."
			bind:value={n.clinicalContext}
		/>
	</Field>
</Fieldset>
