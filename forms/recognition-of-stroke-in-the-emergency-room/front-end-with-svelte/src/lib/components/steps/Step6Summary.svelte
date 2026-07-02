<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateRosierGrade } from '$lib/engine/rosier-grader';
	import { bandLabel, bandColor, signed } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const n = assessment.data.note;
	const grade = $derived(calculateRosierGrade(assessment.data));
</script>

<Fieldset legend="Step 6 of 6 — Summary and score">
	<p class="hint">
		Live ROSIER total and a free-text clinical note. Submit to generate the full report.
	</p>

	<Field label="Live ROSIER score">
		<span class="inline-flex items-center gap-3">
			<strong class="text-lg text-base-content">{signed(grade.rosierScore)} (range -2 to +5)</strong>
			<span
				class="inline-block rounded-full border px-3 py-1 text-sm font-bold {bandColor(grade.band)}"
			>
				{bandLabel(grade.band)}
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
