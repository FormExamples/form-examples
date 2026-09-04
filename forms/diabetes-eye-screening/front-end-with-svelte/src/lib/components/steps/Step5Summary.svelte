<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { calculateGrade } from '#lib/engine/diabetes-eye-grader.js';
	import {
		outcomeColor,
		outcomeLabel,
		referralLabel,
		recallIntervalLabel,
		retinopathyLabel,
		maculopathyLabel,
		statusLabel
	} from '#lib/engine/utils.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const n = assessment.data.note;
	const grade = $derived(calculateGrade(assessment.data));
</script>

<Fieldset legend="Step 5 of 5 — Summary and clinical note">
	<p class="hint">
		Live worst-eye classification, recall / referral outcome, and a free-text clinical note. Submit
		to generate the full report. This is a classification, not a numeric score.
	</p>

	<Field label="Live outcome">
		<span class="inline-flex flex-wrap items-center gap-3">
			<span
				class="inline-block rounded-full border px-3 py-1 text-sm font-bold {outcomeColor(
					grade.recallPathway
				)}"
			>
				{outcomeLabel(grade.recallPathway)}
			</span>
			<span class="text-sm text-base-content/70">
				{referralLabel(grade.referral)} · {recallIntervalLabel(grade.recallIntervalMonths)} · {statusLabel(
					grade.status
				)}
			</span>
		</span>
	</Field>

	<Field label="Worst-eye grades">
		<span class="text-sm text-base-content/70">
			{retinopathyLabel(grade.worstRetinopathy)} · {maculopathyLabel(grade.worstMaculopathy)}{grade.anyUngradable
				? ' · an eye is ungradable'
				: ''}
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
