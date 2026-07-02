<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { gradeMews } from '$lib/engine/mews-grader';
	import { riskBandLabel, riskBandColor } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const s = assessment.data.summary;
	const grade = $derived(gradeMews(assessment.data));
</script>

<Fieldset legend="Step 8 of 8 — Review and sign-off">
	<p class="hint">
		Optional previous aggregate for the deteriorating-trend flag, a free-text clinical note, and the
		live aggregate MEWS. Submit to generate the full report.
	</p>

	<Field
		label="Previous MEWS aggregate (optional)"
		description="The aggregate from the previous observation set, used only to flag a deteriorating trend; it is never added to this aggregate."
		inputId="summary-previousMewsScore"
	>
		<NumberInput
			id="summary-previousMewsScore"
			label="Previous MEWS aggregate"
			min={0}
			max={14}
			step={1}
			bind:value={s.previousMewsScore}
		/>
	</Field>

	<Field label="Live MEWS aggregate">
		<span class="inline-flex flex-wrap items-center gap-3">
			<strong class="text-lg text-base-content">{grade.mewsScore}</strong>
			<span
				class="inline-block rounded-full border px-3 py-1 text-sm font-bold {riskBandColor(grade.riskBand)}"
			>
				{riskBandLabel(grade.riskBand)}
			</span>
			{#if grade.singleParameterTrigger}
				<span
					class="inline-block rounded-full border px-3 py-1 text-sm font-bold bg-error text-error-content border-error"
				>
					Single-parameter trigger
				</span>
			{/if}
		</span>
	</Field>

	<Field label="Recommended monitoring frequency">
		<span class="text-sm text-base-content/80">{grade.monitoringFrequency}</span>
	</Field>

	{#if !grade.complete}
		<p class="hint">
			Some observations are not yet recorded — the aggregate may understate risk until every
			parameter is supplied.
		</p>
	{/if}

	<Field label="Clinical note" inputId="summary-clinicalNotes">
		<TextAreaInput
			id="summary-clinicalNotes"
			label="Clinical note"
			rows={4}
			placeholder="Free-text clinical note: context, decisions, and any escalation already actioned."
			bind:value={s.clinicalNotes}
		/>
	</Field>
</Fieldset>
