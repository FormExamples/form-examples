<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { calculateRespectGrade } from '#lib/engine/respect-grader.js';
	import { statusLabel, statusColor } from '#lib/engine/utils.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Badge from '#lib/components/ui/Badge.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const grade = $derived(calculateRespectGrade(assessment.data));
</script>

<Fieldset legend="Step 9 of 9 — Summary">
	<p class="hint">
		The live completeness status and a free-text note. Submit to generate the full report.
	</p>

	<Field label="Live completeness status">
		<span class="inline-flex flex-wrap items-center gap-3">
			<Badge label={statusLabel(grade.status)} colorClass={statusColor(grade.status)} />
			<strong class="text-base text-base-content">{grade.completenessPercent}% complete</strong>
			<span class="text-sm text-base-content/70">
				{grade.satisfiedCount} of {grade.mandatoryCount} mandatory rules satisfied
			</span>
		</span>
	</Field>

	<Field label="Clinician note" inputId="note-field">
		<TextAreaInput
			id="note-field"
			label="Clinician note"
			rows={3}
			placeholder="Free-text note: context, decisions, and anything to hand over."
			bind:value={assessment.data.note}
		/>
	</Field>
</Fieldset>
