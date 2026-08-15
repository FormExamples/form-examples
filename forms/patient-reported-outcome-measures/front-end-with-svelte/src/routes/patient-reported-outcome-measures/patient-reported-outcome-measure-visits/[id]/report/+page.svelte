<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Button from '#lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	let pdfError = $state('');

	function fmt(v: number | null, digits = 1): string {
		return v === null ? '—' : v.toFixed(digits);
	}

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(
				`/patient-reported-outcome-measures/patient-reported-outcome-measure-visits/${id}/report/pdf`,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ data: assessment.data, result: assessment.result })
				}
			);
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `patient-reported-outcome-measures-${data.visitDetails.subjectId || id}.pdf`;
				a.click();
				URL.revokeObjectURL(url);
			} else {
				pdfError = 'Failed to generate PDF. Please try again.';
			}
		} catch {
			pdfError = 'Failed to generate PDF. Please check your connection and try again.';
		}
	}
</script>

<header class="border-b border-base-300 bg-base-100 shadow-sm no-print">
	<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
		<h1 class="text-lg font-bold text-base-content">Patient-reported outcome measures report</h1>
		<div class="flex items-center gap-3">
			{#if pdfError}
				<span class="text-sm text-error">{pdfError}</span>
			{/if}
			<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
			<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
			<Button
				data-variant="secondary"
				onclick={() =>
					goto(
						`/patient-reported-outcome-measures/patient-reported-outcome-measure-visits/${id}`
					)}>Edit</Button
			>
		</div>
	</div>
</header>

<main class="mx-16 px-4 py-6">
	<!-- Visit header -->
	<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
		<h2 class="mb-4 text-lg font-bold text-base-content">Visit</h2>
		<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-3">
			<div><span class="font-medium text-base-content/70">Subject ID:</span> {data.visitDetails.subjectId || '—'}</div>
			<div><span class="font-medium text-base-content/70">Visit:</span> {data.visitDetails.visit || '—'}</div>
			<div><span class="font-medium text-base-content/70">Assessment date:</span> {data.visitDetails.assessmentDate || '—'}</div>
		</div>
	</div>

	<!-- SF-36 -->
	<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
		<h2 class="mb-4 text-lg font-bold text-base-content">SF-36v2 domain scores (0-100, higher = better)</h2>
		<table class="w-full text-sm">
			<thead>
				<tr class="border-b border-base-300 text-left text-base-content/70">
					<th class="pb-2 pr-4">Domain</th>
					<th class="pb-2">Score</th>
				</tr>
			</thead>
			<tbody>
				<tr class="border-b border-base-200"><td class="py-1.5 pr-4">Physical Functioning (PF)</td><td class="py-1.5">{fmt(result.sf36.pf)}</td></tr>
				<tr class="border-b border-base-200"><td class="py-1.5 pr-4">Role-Physical (RP)</td><td class="py-1.5">{fmt(result.sf36.rp)}</td></tr>
				<tr class="border-b border-base-200"><td class="py-1.5 pr-4">Bodily Pain (BP)</td><td class="py-1.5">{fmt(result.sf36.bp)}</td></tr>
				<tr class="border-b border-base-200"><td class="py-1.5 pr-4">General Health (GH)</td><td class="py-1.5">{fmt(result.sf36.gh)}</td></tr>
				<tr class="border-b border-base-200"><td class="py-1.5 pr-4">Vitality (VT)</td><td class="py-1.5">{fmt(result.sf36.vt)}</td></tr>
				<tr class="border-b border-base-200"><td class="py-1.5 pr-4">Social Functioning (SF)</td><td class="py-1.5">{fmt(result.sf36.sf)}</td></tr>
				<tr class="border-b border-base-200"><td class="py-1.5 pr-4">Role-Emotional (RE)</td><td class="py-1.5">{fmt(result.sf36.re)}</td></tr>
				<tr class="border-b border-base-200"><td class="py-1.5 pr-4">Mental Health (MH)</td><td class="py-1.5">{fmt(result.sf36.mh)}</td></tr>
			</tbody>
		</table>
		<p class="mt-4 text-sm">
			<strong>PCS (approx.):</strong> {fmt(result.sf36.pcsApprox)} &middot;
			<strong>MCS (approx.):</strong> {fmt(result.sf36.mcsApprox)}
		</p>
		<p class="mt-2 text-xs italic text-base-content/60">
			Simplified, non-licensed unweighted-average approximations — <em>not</em> the licensed
			QualityMetric norm-based SF-36v2 PCS/MCS.
		</p>
	</div>

	<!-- NDI -->
	<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
		<h2 class="mb-4 text-lg font-bold text-base-content">Neck Disability Index (NDI)</h2>
		<p class="text-sm">
			{result.ndi.percentageScore === null ? '—' : `${fmt(result.ndi.percentageScore)}%`}
			{#if result.ndi.band}
				<span class="ml-2 inline-block rounded-full border px-2 py-0.5 text-xs font-bold">{result.ndi.band}</span>
			{/if}
			<span class="ml-2 text-base-content/60">({result.ndi.rawScore} raw / {result.ndi.answeredSections} sections answered)</span>
		</p>
	</div>

	<!-- mJOA -->
	<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
		<h2 class="mb-4 text-lg font-bold text-base-content">modified JOA (mJOA)</h2>
		<p class="text-sm">
			{result.mjoa.totalScore === null ? '—' : `${result.mjoa.totalScore} of 17`}
			{#if result.mjoa.band}
				<span class="ml-2 inline-block rounded-full border px-2 py-0.5 text-xs font-bold">{result.mjoa.band}</span>
			{/if}
		</p>
	</div>

	<!-- EQ-5D -->
	<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
		<h2 class="mb-4 text-lg font-bold text-base-content">EQ-5D-3L</h2>
		<p class="text-sm">
			Health state: {result.eq5d.healthStateDescriptor || '—'} &middot; UK index:
			{result.eq5d.ukIndexValue === null ? '—' : result.eq5d.ukIndexValue.toFixed(3)} &middot; VAS:
			{result.eq5d.vasScore ?? '—'}
		</p>
	</div>

	<p class="text-xs italic text-base-content/60">
		There is no single composite score across the four instruments — each is scored independently.
	</p>
</main>
