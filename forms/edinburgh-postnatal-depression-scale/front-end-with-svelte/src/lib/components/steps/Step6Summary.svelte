<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { calculateEpdsGrade } from '#lib/engine/epds-grader.js';
	import { bandLabel, bandColor } from '#lib/engine/utils.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const n = assessment.data.note;
	const grade = $derived(calculateEpdsGrade(assessment.data));
	const missing = $derived(
		Object.values(assessment.data.items).filter((v) => v === null || v === undefined).length
	);
</script>

<Fieldset legend="Step 6 of 6 — Summary and score">
	<p class="hint">
		Live EPDS total and a free-text clinical note. Submit to generate the full report.
	</p>

	<Field label="Live EPDS total">
		<span class="inline-flex flex-wrap items-center gap-3">
			<strong class="text-lg text-base-content">{grade.totalScore} of 30</strong>
			<span
				class="inline-block rounded-full border px-3 py-1 text-sm font-bold {bandColor(grade.band)}"
			>
				{bandLabel(grade.band)}
			</span>
			{#if missing > 0}
				<span class="text-sm text-base-content/60"
					>({missing} item{missing === 1 ? '' : 's'} still unanswered)</span
				>
			{/if}
			{#if grade.selfHarmFlag}
				<span
					class="inline-block rounded-full border px-3 py-1 text-sm font-bold bg-error text-error-content border-error"
					>Self-harm flag raised</span
				>
			{/if}
		</span>
	</Field>

	<Field label="Clinical note" inputId="note-clinicalNote">
		<TextAreaInput
			id="note-clinicalNote"
			label="Clinical note"
			rows={4}
			placeholder="Free-text clinical note: context, decisions, and any safeguarding or referral action already taken."
			bind:value={n.clinicalNote}
		/>
	</Field>
</Fieldset>
