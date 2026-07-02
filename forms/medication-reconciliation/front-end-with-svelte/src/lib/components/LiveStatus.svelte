<script lang="ts">
	// Live status readout — mirrors the HTML front-end's `renderLiveSummary`.
	// Runs the shared engine over the current store data and shows the derived
	// status and counts, updating as the child lists grow.
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateReconciliation } from '$lib/engine/medication-reconciliation-grader';
	import { statusLabel, statusColor } from '$lib/engine/utils';
	import Badge from '$lib/components/ui/Badge.svelte';

	const g = $derived(calculateReconciliation(assessment.data));
</script>

<div class="rounded-lg border border-base-300 bg-base-200 p-4 text-sm">
	<div class="mb-2 flex items-center gap-2">
		<span class="font-medium text-base-content/80">Live status</span>
		<Badge label={statusLabel(g.status)} colorClass={statusColor(g.status)} />
	</div>
	<ul class="space-y-1 text-base-content/70">
		<li>
			<strong class={g.sourceCount >= 2 ? 'text-success' : 'text-warning'}>{g.sourceCount}</strong>
			source(s) ({g.verifiedSourceCount} verified) — minimum 2 required
		</li>
		<li>
			<strong>{g.lineItemCount}</strong> line item(s): {g.bpmhCount} BPMH, {g.inpatientCount} inpatient
		</li>
		<li>
			<strong>{g.discrepancyCount}</strong> discrepancy(ies): {g.intentionalCount} intentional,
			<strong class={g.unintentionalCount > 0 ? 'text-error' : 'text-success'}
				>{g.unintentionalCount}</strong
			> unintentional
		</li>
	</ul>
</div>
