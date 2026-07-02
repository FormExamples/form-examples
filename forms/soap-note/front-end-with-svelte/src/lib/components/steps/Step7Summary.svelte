<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateSoapGrade } from '$lib/engine/soap-note-grader';
	import { statusLabel, statusColor } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const s = assessment.data.summary;
	const grade = $derived(calculateSoapGrade(assessment.data));
	const present = $derived(grade.sectionStatuses.filter((x) => x.present).length);
</script>

<Fieldset legend="Step 7 of 7 — Summary and completeness">
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
				{grade.completenessPercent}% complete ({present} of {grade.sectionStatuses.length} SOAP sections
				present);
				{grade.flags.length}
				{grade.flags.length === 1 ? 'safety flag' : 'safety flags'} raised.
			</span>
		</div>
	</Field>

	<Field label="Clinical note" inputId="summary-clinicalNote">
		<TextAreaInput
			id="summary-clinicalNote"
			label="Clinical note"
			rows={5}
			placeholder="Free-text narrative: context, decisions, and any actions already taken."
			bind:value={s.clinicalNote}
		/>
	</Field>
</Fieldset>
