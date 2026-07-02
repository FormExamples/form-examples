<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculatePacuGrade } from '$lib/engine/pacu-grader';
	import { readinessBandLabel, readinessBandColor } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const n = assessment.data.note;
	const grade = $derived(calculatePacuGrade(assessment.data));
</script>

<Fieldset legend="Step 10 of 10 — Summary and score">
	<p class="hint">
		Live Modified Aldrete total and discharge-readiness band, plus a free-text recovery note. Submit
		to generate the full report.
	</p>

	<Field label="Live Modified Aldrete score">
		<span class="inline-flex items-center gap-3">
			<strong class="text-lg text-base-content">{grade.aldreteTotal} of 10</strong>
			<span
				class="inline-block rounded-full border px-3 py-1 text-sm font-bold {readinessBandColor(
					grade.readinessBand
				)}"
			>
				{readinessBandLabel(grade.readinessBand)}
			</span>
		</span>
	</Field>

	<Field label="Recovery note" inputId="note-recoveryNote">
		<TextAreaInput
			id="note-recoveryNote"
			label="Recovery note"
			rows={4}
			placeholder="Free-text recovery note: observations, decisions, and any escalation already actioned."
			bind:value={n.recoveryNote}
		/>
	</Field>
</Fieldset>
