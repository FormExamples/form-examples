<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { calculateAuditcGrade } from '#lib/engine/auditc-grader.js';
	import { riskBandLabel, riskBandColor } from '#lib/engine/utils.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const n = assessment.data.note;
	const grade = $derived(calculateAuditcGrade(assessment.data));
</script>

<Fieldset legend="Step 6 of 6 — Summary and score">
	<p class="hint">
		Live AUDIT-C total and a free-text clinical note. Submit to generate the full report.
	</p>

	<Field label="Live AUDIT-C score">
		<span class="inline-flex items-center gap-3">
			<strong class="text-lg text-base-content">{grade.auditcScore} of 12</strong>
			<span
				class="inline-block rounded-full border px-3 py-1 text-sm font-bold {riskBandColor(grade.riskBand)}"
			>
				{riskBandLabel(grade.riskBand)}
			</span>
		</span>
	</Field>

	<Field label="Clinical note" inputId="note-clinicalNote">
		<TextAreaInput
			id="note-clinicalNote"
			label="Clinical note"
			rows={4}
			placeholder="Free-text clinical note: context, brief intervention delivered, and any onward referral."
			bind:value={n.clinicalNote}
		/>
	</Field>
</Fieldset>
