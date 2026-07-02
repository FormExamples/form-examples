<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateEgfr } from '$lib/engine/egfr-grader';
	import { stageColor, stageLabel, formatEgfr } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const n = assessment.data.note;
	const grade = $derived(calculateEgfr(assessment.data));
</script>

<Fieldset legend="Step 4 of 4 — Summary and result">
	<p class="hint">
		Live eGFR, CKD G-stage, and a free-text clinical note. Submit to generate the full report.
	</p>

	<Field label="Live eGFR">
		<span class="inline-flex items-center gap-3">
			<strong class="text-lg text-base-content">{formatEgfr(grade.egfr)}</strong>
			<span
				class="inline-block rounded-full border px-3 py-1 text-sm font-bold {stageColor(
					grade.egfrStage
				)}"
			>
				{stageLabel(grade.egfrStage)}
			</span>
		</span>
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
