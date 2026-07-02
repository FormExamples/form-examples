<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { gradeNews2 } from '$lib/engine/news2-grader';
	import { riskBandLabel, riskBandColor } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const n = assessment.data.note;
	const grade = $derived(gradeNews2(assessment.data));
</script>

<Fieldset legend="Step 10 of 10 — Review and sign-off">
	<p class="hint">
		Live aggregate NEWS2 total and a free-text clinical note. Submit to generate the full report.
	</p>

	<Field label="Live NEWS2 aggregate">
		<span class="inline-flex flex-wrap items-center gap-3">
			<strong class="text-lg text-base-content">{grade.aggregate}</strong>
			<span
				class="inline-block rounded-full border px-3 py-1 text-sm font-bold {riskBandColor(grade.riskBand)}"
			>
				{riskBandLabel(grade.riskBand)}
			</span>
			{#if grade.redScore}
				<span
					class="inline-block rounded-full border px-3 py-1 text-sm font-bold bg-error text-error-content border-error"
				>
					Red score
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
