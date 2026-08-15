<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { calculateGrade } from '#lib/engine/partogram-grader.js';
	import { progressLabel, progressColor, priorityColor, priorityLabel } from '#lib/engine/utils.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';

	const grade = $derived(calculateGrade(assessment.data));
	const fmtCm = (v: number | null) => (v === null ? '—' : `${v.toFixed(1)} cm`);
	const fmtHours = (v: number | null) => (v === null ? '—' : `${v.toFixed(1)} h`);
</script>

<Fieldset legend="Step 5 of 5 — Summary and progress">
	<p class="hint">
		Live labour-progress classification, reference-line expectations, and flagged issues. Submit to
		generate the full report.
	</p>

	<div class="mb-4 rounded-xl border-2 p-4 text-center {progressColor(grade.progressClassification)}">
		<div class="text-2xl font-bold">{progressLabel(grade.progressClassification)}</div>
		<div class="mt-1 text-sm font-semibold">
			{grade.latestDilatationCm === null
				? 'No cervical dilatation recorded — progress cannot be plotted'
				: `Latest dilatation ${grade.latestDilatationCm} cm at ${fmtHours(grade.elapsedHours)} of active labour`}
		</div>
	</div>

	<table class="mb-4 w-full text-sm">
		<tbody>
			<tr class="border-b border-base-200">
				<th class="py-2 pr-4 text-left font-medium text-base-content/70">Elapsed time (t)</th>
				<td class="py-2">{fmtHours(grade.elapsedHours)}</td>
			</tr>
			<tr class="border-b border-base-200">
				<th class="py-2 pr-4 text-left font-medium text-base-content/70">Alert line expects</th>
				<td class="py-2">{fmtCm(grade.alertLineExpectedCm)}</td>
			</tr>
			<tr class="border-b border-base-200">
				<th class="py-2 pr-4 text-left font-medium text-base-content/70">Action line expects</th>
				<td class="py-2">{fmtCm(grade.actionLineExpectedCm)}</td>
			</tr>
			<tr class="border-b border-base-200">
				<th class="py-2 pr-4 text-left font-medium text-base-content/70">Observations recorded</th>
				<td class="py-2">{assessment.data.observations.length}</td>
			</tr>
		</tbody>
	</table>

	<h4 class="mb-2 font-semibold text-base-content">Flagged issues ({grade.flaggedIssues.length})</h4>
	{#if grade.flaggedIssues.length === 0}
		<p class="text-sm text-base-content/70">No flagged issues.</p>
	{:else}
		<div class="space-y-2">
			{#each grade.flaggedIssues as flag (flag.id)}
				<div class="flex items-start gap-3 rounded-lg border p-3 {priorityColor(flag.priority)}">
					<span
						class="mt-0.5 rounded px-2 py-0.5 text-xs font-bold uppercase {priorityColor(
							flag.priority
						)}"
					>
						{priorityLabel(flag.priority)}
					</span>
					<div>
						<span class="font-medium">{flag.category}:</span>
						{flag.description}
					</div>
				</div>
			{/each}
		</div>
	{/if}
</Fieldset>
