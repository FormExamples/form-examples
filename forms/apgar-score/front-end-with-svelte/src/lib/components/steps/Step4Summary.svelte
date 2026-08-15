<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { calculateApgarGrade } from '#lib/engine/apgar-grader.js';
	import { bandColor, bandLabel, trendLabel } from '#lib/engine/utils.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const s = assessment.data.summary;
	const grade = $derived(calculateApgarGrade(assessment.data));
	const scored = $derived(grade.timepoints.filter((t) => t.scored));
</script>

<Fieldset legend="Step 4 of 4 — Resuscitation and summary">
	<p class="hint">
		Record any resuscitation given, review the per-timepoint totals and trend, and add a clinical
		note. Submit to generate the full report.
	</p>

	<Field
		label="Resuscitation measures given"
		description="e.g. drying and stimulation, airway positioning, oxygen, inflation breaths (IPPV), chest compressions."
		inputId="summary-resuscitationMeasures"
	>
		<TextAreaInput
			id="summary-resuscitationMeasures"
			label="Resuscitation measures given"
			rows={3}
			placeholder="Describe the measures given, if any."
			bind:value={s.resuscitationMeasures}
		/>
	</Field>

	<Field label="Live Apgar summary">
		{#if scored.length === 0}
			<p class="text-sm text-base-content/60">Score at least one timepoint to see the summary.</p>
		{:else}
			<div class="flex flex-wrap items-center gap-2">
				{#each scored as g (g.timepointMinutes)}
					<span
						class="inline-block rounded-full border px-3 py-1 text-xs font-bold {bandColor(g.band)}"
					>
						{g.timepointMinutes == null ? '?' : g.timepointMinutes} min: {g.total}/10 — {bandLabel(
							g.band
						)}
					</span>
				{/each}
				<span class="text-sm text-base-content/70">Trend: {trendLabel(grade.trend)}</span>
			</div>
		{/if}
	</Field>

	<Field label="Clinical note" inputId="summary-clinicianNote">
		<TextAreaInput
			id="summary-clinicianNote"
			label="Clinical note"
			rows={4}
			placeholder="Free-text clinical note: context, decisions, and any escalation already actioned."
			bind:value={s.clinicianNote}
		/>
	</Field>
</Fieldset>
