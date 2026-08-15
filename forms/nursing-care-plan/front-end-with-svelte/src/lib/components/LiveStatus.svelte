<script lang="ts">
	// Live status readout. Runs the shared engine over the current store data and
	// shows the derived plan status, completeness percent, and per-problem class
	// counts, updating live as problems / goals / interventions are added.
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { gradeCarePlan } from '#lib/engine/nursing-care-plan-grader.js';
	import { completenessLabel, completenessColor } from '#lib/engine/utils.js';
	import Badge from '#lib/components/ui/Badge.svelte';

	const g = $derived(gradeCarePlan(assessment.data));
	const problemCount = $derived(assessment.data.problems.length);
	const completeCount = $derived(
		g.problemClasses.filter((c) => c.completenessClass === 'complete').length
	);
	const partialCount = $derived(
		g.problemClasses.filter((c) => c.completenessClass === 'partial').length
	);
	const incompleteCount = $derived(
		g.problemClasses.filter((c) => c.completenessClass === 'incomplete').length
	);
	const highFlagCount = $derived(g.flags.filter((f) => f.priority === 'high').length);
</script>

<div class="rounded-lg border border-base-300 bg-base-200 p-4 text-sm">
	<div class="mb-2 flex items-center gap-2">
		<span class="font-medium text-base-content/80">Live status</span>
		<Badge label={completenessLabel(g.status)} colorClass={completenessColor(g.status)} />
	</div>
	<ul class="space-y-1 text-base-content/70">
		<li>
			<strong>{g.completenessPercent}%</strong> of required care-process elements present
		</li>
		<li>
			<strong>{problemCount}</strong> problem(s): {completeCount} complete, {partialCount} partial,
			<strong class={incompleteCount > 0 ? 'text-warning' : 'text-success'}>{incompleteCount}</strong>
			incomplete
		</li>
		<li>
			<strong class={highFlagCount > 0 ? 'text-error' : 'text-success'}>{highFlagCount}</strong>
			high-priority flag(s), {g.flags.length} total
		</li>
	</ul>
</div>
