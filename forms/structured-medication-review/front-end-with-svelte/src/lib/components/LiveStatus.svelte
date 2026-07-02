<script lang="ts">
	// Live status readout — mirrors the HTML front-end's `renderLiveSummary`.
	// Runs the shared engine over the current store data and shows the derived
	// burden band, review status, and counts, updating as the medicine list grows.
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateReview } from '$lib/engine/structured-medication-review-grader';
	import {
		reviewStatusLabel,
		reviewStatusColor,
		burdenBandLabel,
		burdenBandColor,
		polypharmacyBandLabel,
		anticholinergicBandLabel
	} from '$lib/engine/utils';
	import Badge from '$lib/components/ui/Badge.svelte';

	const g = $derived(calculateReview(assessment.data));
</script>

<div class="rounded-lg border border-base-300 bg-base-200 p-4 text-sm">
	<div class="mb-2 flex flex-wrap items-center gap-2">
		<span class="font-medium text-base-content/80">Live burden and status</span>
		<Badge label={burdenBandLabel(g.burdenBand)} colorClass={burdenBandColor(g.burdenBand)} />
		<Badge label={reviewStatusLabel(g.reviewStatus)} colorClass={reviewStatusColor(g.reviewStatus)} />
	</div>
	<ul class="space-y-1 text-base-content/70">
		<li>
			<strong>{g.medicineCount}</strong> medicine(s), <strong>{g.regularMedicineCount}</strong> regular
			— {polypharmacyBandLabel(g.polypharmacyBand)}
		</li>
		<li>
			Anticholinergic burden
			<strong class={g.anticholinergicBand === 'significant' ? 'text-error' : 'text-success'}
				>{g.anticholinergicBurdenScore}</strong
			>
			— {anticholinergicBandLabel(g.anticholinergicBand)}
		</li>
		<li>
			<strong>{g.stopFlags.length}</strong> STOPP, <strong>{g.startFlags.length}</strong> START criterion
			/ criteria
		</li>
	</ul>
</div>
