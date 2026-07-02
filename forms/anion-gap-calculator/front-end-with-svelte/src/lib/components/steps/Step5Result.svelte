<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateAnionGap } from '$lib/engine/anion-gap-grader';
	import { classificationColor, classificationLabel, formatGap } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const n = assessment.data.note;
	const grade = $derived(calculateAnionGap(assessment.data));
</script>

<Fieldset legend="Step 5 of 5 — Result and interpretation">
	<p class="hint">
		Live anion gap, albumin-corrected gap, classification, and a free-text clinical note. A high gap
		should trigger a structured search for the cause (GOLDMARK / MUDPILES). Submit to generate the
		full report.
	</p>

	<Field label="Live anion gap">
		<span class="inline-flex flex-wrap items-center gap-3">
			<strong class="text-lg text-base-content">{formatGap(grade.anionGap)}</strong>
			{#if grade.correctedAnionGap !== null}
				<span class="text-sm text-base-content/70"
					>corrected {formatGap(grade.correctedAnionGap)}</span
				>
			{/if}
			<span
				class="inline-block rounded-full border px-3 py-1 text-sm font-bold {classificationColor(
					grade.classification
				)}"
			>
				{classificationLabel(grade.classification)}
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
