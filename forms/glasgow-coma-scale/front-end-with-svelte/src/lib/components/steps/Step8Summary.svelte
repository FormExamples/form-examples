<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateGcsGrade } from '$lib/engine/gcs-grader';
	import { severityBandLabel, severityBandColor } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const n = assessment.data.note;
	const grade = $derived(calculateGcsGrade(assessment.data));
</script>

<Fieldset legend="Step 8 of 8 — Summary and score">
	<p class="hint">
		Live GCS total, breakdown, and GCS-Pupils, plus a free-text clinical note. Submit to generate
		the full report.
	</p>

	<Field label="Live GCS score">
		<span class="inline-flex flex-wrap items-center gap-3">
			<strong class="text-lg text-base-content">{grade.totalDisplay || 'Not scored'}</strong>
			<span class="text-sm text-base-content/70">{grade.breakdown || 'Incomplete'}</span>
			<span
				class="inline-block rounded-full border px-3 py-1 text-sm font-bold {severityBandColor(
					grade.severityBand
				)}"
			>
				{severityBandLabel(grade.severityBand)}
			</span>
		</span>
	</Field>

	<Field label="GCS-Pupils (GCS-P)">
		<strong class="text-base-content">{grade.gcsP !== null ? grade.gcsP : 'Not scored'}</strong>
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
