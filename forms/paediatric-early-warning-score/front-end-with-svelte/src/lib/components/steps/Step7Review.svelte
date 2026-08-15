<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { gradePews } from '#lib/engine/pews-grader.js';
	import { escalationBandLabel, escalationBandColor } from '#lib/engine/utils.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const n = assessment.data.note;
	const grade = $derived(gradePews(assessment.data));
</script>

<Fieldset legend="Step 7 of 7 — Review and sign-off">
	<p class="hint">
		Live aggregate PEWS total and escalation band, plus a free-text clinical note. Submit to
		generate the full report.
	</p>

	<Field label="Live PEWS aggregate">
		<span class="inline-flex flex-wrap items-center gap-3">
			<strong class="text-lg text-base-content">{grade.aggregateScore}</strong>
			<span
				class="inline-block rounded-full border px-3 py-1 text-sm font-bold {escalationBandColor(grade.escalationBand)}"
			>
				{escalationBandLabel(grade.escalationBand)}
			</span>
			{#if grade.singleParameterTrigger}
				<span
					class="inline-block rounded-full border px-3 py-1 text-sm font-bold bg-error text-error-content border-error"
				>
					Single parameter = 3
				</span>
			{/if}
		</span>
	</Field>

	<Field label="Recommended monitoring frequency">
		<span class="text-sm text-base-content/80">{grade.monitoringFrequency}</span>
	</Field>

	{#if !grade.complete}
		<p class="hint">
			Some observations (or the age band) are not yet recorded — the aggregate may understate risk
			until every parameter is supplied.
		</p>
	{/if}

	<Field label="Clinical note" inputId="note-clinicalNotes">
		<TextAreaInput
			id="note-clinicalNotes"
			label="Clinical note"
			rows={4}
			placeholder="Free-text clinical note: context, decisions, and any escalation already actioned."
			bind:value={n.clinicalNotes}
		/>
	</Field>
</Fieldset>
