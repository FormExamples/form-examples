<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';

	const result = $derived(assessment.result);

	function fmt(v: number | null, digits = 1): string {
		return v === null ? '—' : v.toFixed(digits);
	}
</script>

<Fieldset legend="Step 9 of 9 — Summary">
	<p class="hint">
		All four instruments are scored independently — there is no cross-instrument composite. Submit
		to generate the full report.
	</p>

	<h3 class="mt-2 text-sm font-semibold text-base-content">SF-36v2 domain scores (0-100, higher = better)</h3>
	<div class="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
		<div><span class="font-medium text-base-content/70">Physical Functioning:</span> {fmt(result.sf36.pf)}</div>
		<div><span class="font-medium text-base-content/70">Role-Physical:</span> {fmt(result.sf36.rp)}</div>
		<div><span class="font-medium text-base-content/70">Bodily Pain:</span> {fmt(result.sf36.bp)}</div>
		<div><span class="font-medium text-base-content/70">General Health:</span> {fmt(result.sf36.gh)}</div>
		<div><span class="font-medium text-base-content/70">Vitality:</span> {fmt(result.sf36.vt)}</div>
		<div><span class="font-medium text-base-content/70">Social Functioning:</span> {fmt(result.sf36.sf)}</div>
		<div><span class="font-medium text-base-content/70">Role-Emotional:</span> {fmt(result.sf36.re)}</div>
		<div><span class="font-medium text-base-content/70">Mental Health:</span> {fmt(result.sf36.mh)}</div>
	</div>
	<p class="hint mt-2">
		<strong>PCS (approx.):</strong> {fmt(result.sf36.pcsApprox)} &middot;
		<strong>MCS (approx.):</strong> {fmt(result.sf36.mcsApprox)}
		— simplified unweighted-average approximations, <em>not</em> the licensed QualityMetric
		norm-based SF-36v2 PCS/MCS.
	</p>

	<h3 class="mt-4 text-sm font-semibold text-base-content">Neck Disability Index (NDI)</h3>
	<p class="text-sm">
		{result.ndi.percentageScore === null ? '—' : `${result.ndi.percentageScore.toFixed(1)}%`}
		{#if result.ndi.band}
			<span class="ml-2 inline-block rounded-full border px-2 py-0.5 text-xs font-bold">
				{result.ndi.band}
			</span>
		{/if}
		<span class="ml-2 text-base-content/60">
			({result.ndi.rawScore} raw / {result.ndi.answeredSections} sections answered)
		</span>
	</p>

	<h3 class="mt-4 text-sm font-semibold text-base-content">modified JOA (mJOA)</h3>
	<p class="text-sm">
		{result.mjoa.totalScore === null ? '—' : `${result.mjoa.totalScore} of 17`}
		{#if result.mjoa.band}
			<span class="ml-2 inline-block rounded-full border px-2 py-0.5 text-xs font-bold">
				{result.mjoa.band}
			</span>
		{/if}
	</p>

	<h3 class="mt-4 text-sm font-semibold text-base-content">EQ-5D-3L</h3>
	<p class="text-sm">
		Health state: {result.eq5d.healthStateDescriptor || '—'} &middot; UK index:
		{result.eq5d.ukIndexValue === null ? '—' : result.eq5d.ukIndexValue.toFixed(3)} &middot; VAS:
		{result.eq5d.vasScore ?? '—'}
	</p>
</Fieldset>
