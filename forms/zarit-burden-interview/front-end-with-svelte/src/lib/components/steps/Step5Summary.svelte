<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateZaritGrade } from '$lib/engine/zarit-grader';
	import { bandLabel, bandColor, instrumentFormLabel } from '$lib/engine/utils';
	import { activeItemNumbers, normalizeInstrumentForm, ratingValue } from '$lib/engine/zarit-rules';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const n = assessment.data.note;
	const instrumentForm = $derived(normalizeInstrumentForm(assessment.data));
	const grade = $derived(calculateZaritGrade(assessment.data));
	const missing = $derived(
		activeItemNumbers(instrumentForm).filter(
			(num) => ratingValue(assessment.data.items[`item${num}` as keyof typeof assessment.data.items]) === null
		).length
	);
</script>

<Fieldset legend="Step 5 of 5 — Summary and score">
	<p class="hint">
		Live {instrumentFormLabel(instrumentForm)} total and a free-text clinical note. Submit to
		generate the full report.
	</p>

	<Field label="Live ZBI total">
		<span class="inline-flex flex-wrap items-center gap-3">
			<strong class="text-lg text-base-content">{grade.totalScore} of {grade.maxScore}</strong>
			<span
				class="inline-block rounded-full border px-3 py-1 text-sm font-bold {bandColor(
					grade.burdenBand
				)}"
			>
				{bandLabel(grade.burdenBand)}
			</span>
			{#if missing > 0}
				<span class="text-sm text-base-content/60"
					>({missing} active item{missing === 1 ? '' : 's'} still unanswered)</span
				>
			{/if}
		</span>
	</Field>

	<Field label="Clinical note" inputId="note-clinicalNote">
		<TextAreaInput
			id="note-clinicalNote"
			label="Clinical note"
			rows={4}
			placeholder="Free-text clinical note: context, decisions, and any carer-support or referral action already taken."
			bind:value={n.clinicalNote}
		/>
	</Field>
</Fieldset>
