<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { gradeFit } from '#lib/engine/bowel-fit-grader.js';
	import { resultClassColor, resultClassLabel, managementActionLabel } from '#lib/engine/utils.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const n = assessment.data.note;
	const grade = $derived(gradeFit(assessment.data));
</script>

<Fieldset legend="Step 7 of 7 — Summary and outcome">
	<p class="hint">
		Live classification, management action, and a free-text clinical note. Submit to generate the
		full report.
	</p>

	<Field label="Live result classification">
		<span class="inline-flex flex-wrap items-center gap-3">
			<span
				class="inline-block rounded-full border px-3 py-1 text-sm font-bold {resultClassColor(
					grade.resultClass
				)}"
			>
				{resultClassLabel(grade.resultClass)}
			</span>
			<strong class="text-base text-base-content">{managementActionLabel(grade.managementAction)}</strong>
		</span>
		{#if grade.symptomaticPathway}
			<p class="mt-2 text-sm font-semibold text-error">
				Red-flag symptoms reported — urgent suspected-cancer pathway regardless of the FIT result.
			</p>
		{/if}
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
