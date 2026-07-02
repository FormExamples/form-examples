<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateWardRoundGrade } from '$lib/engine/ward-round-grader';
	import { statusLabel, statusColor } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const s = assessment.data.summary;
	const grade = $derived(calculateWardRoundGrade(assessment.data));
</script>

<Fieldset legend="Step 11 of 11 — Summary and completeness">
	<p class="hint">
		Live completeness status, plus a free-text clinical note. Submit to generate the full report.
	</p>

	<Field label="Live completeness">
		<div class="flex flex-wrap items-center gap-3">
			<span
				class="inline-block rounded-full border px-3 py-1 text-sm font-bold {statusColor(
					grade.status
				)}"
			>
				{statusLabel(grade.status)}
			</span>
			<span class="text-sm text-base-content/70">
				{grade.completenessPercent}% complete ({grade.documentedRequired} of {grade.totalRequired} required
				components documented);
				{grade.flags.length}
				{grade.flags.length === 1 ? 'safety flag' : 'safety flags'} raised.
			</span>
		</div>
	</Field>

	<Field label="Clinical note" inputId="summary-clinicalNote">
		<TextAreaInput
			id="summary-clinicalNote"
			label="Clinical note"
			rows={4}
			placeholder="Free-text narrative: context, decisions, and any actions already taken."
			bind:value={s.clinicalNote}
		/>
	</Field>
</Fieldset>
