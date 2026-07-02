<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateFourATGrade } from '$lib/engine/fourat-grader';
	import { interpretationBandLabel, interpretationBandColor } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const n = assessment.data.note;
	const grade = $derived(calculateFourATGrade(assessment.data));
</script>

<Fieldset legend="Step 6 of 6 — Summary and sign-off">
	<p class="hint">
		Live 4AT total and a free-text clinical note. Submit to generate the full report.
	</p>

	<Field label="Live 4AT score">
		<span class="inline-flex items-center gap-3">
			<strong class="text-lg text-base-content">{grade.totalScore} of 12</strong>
			<span
				class="inline-block rounded-full border px-3 py-1 text-sm font-bold {interpretationBandColor(
					grade.interpretationBand
				)}"
			>
				{interpretationBandLabel(grade.interpretationBand)}
			</span>
		</span>
	</Field>

	<Field label="Clinical notes" inputId="note-clinicalNotes">
		<TextAreaInput
			id="note-clinicalNotes"
			label="Clinical notes"
			rows={4}
			placeholder="Free-text clinical note: context, decisions, and any escalation already actioned."
			bind:value={n.clinicalNotes}
		/>
	</Field>
</Fieldset>
