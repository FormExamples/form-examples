<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import {
		complexityLabel,
		complexityColor,
		priorityColor,
		classLabel,
		lensTypeLabel,
		fmtDioptres,
		ageInYears
	} from '#lib/engine/utils.js';
	import Button from '#lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);
	const effective = $derived(
		(data.grade.overrideComplexity || result.complexity) as 'simple' | 'moderate' | 'complex'
	);
	const age = $derived(ageInYears(data.patient.birthDate, data.examination.issueDate));

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/eye-prescriptions/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `eye-prescription-${data.patient.name || id}.pdf`;
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
		<h1 class="text-lg font-bold text-base-content">Eye prescription report</h1>
		<div class="flex items-center gap-3">
			{#if pdfError}
				<span class="text-sm text-error">{pdfError}</span>
			{/if}
			<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
			<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
			<Button data-variant="secondary" onclick={() => goto(`/eye-prescription/eye-prescriptions/${id}`)}>Edit</Button>
		</div>
	</div>
</header>

<main class="mx-16 px-4 py-6">
	<!-- Complexity banner -->
	<div class="mb-6 rounded-xl border-2 p-6 text-center {complexityColor(effective)}">
		<div class="text-3xl font-bold">{complexityLabel(effective)} prescription</div>
		<div class="mt-2 flex justify-center gap-6 text-sm">
			<span>Right: {classLabel(result.rightEyeSphereClass)} / {classLabel(result.rightEyeCylinderClass)}</span>
			<span>Left: {classLabel(result.leftEyeSphereClass)} / {classLabel(result.leftEyeCylinderClass)}</span>
		</div>
		{#if data.grade.overrideComplexity}
			<div class="mt-2 text-sm opacity-75">
				Clinician override (computed: {complexityLabel(result.complexity)})
			</div>
		{/if}
	</div>

	<!-- Refraction table -->
	<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
		<h2 class="mb-4 text-lg font-bold text-base-content">Refraction</h2>
		<table class="w-full text-sm">
			<thead>
				<tr class="border-b border-base-300 text-left text-base-content/70">
					<th class="pb-2 pr-4">Eye</th>
					<th class="pb-2 pr-4">Sphere</th>
					<th class="pb-2 pr-4">Cylinder</th>
					<th class="pb-2 pr-4">Axis</th>
					<th class="pb-2 pr-4">Add</th>
					<th class="pb-2">Prism</th>
				</tr>
			</thead>
			<tbody>
				<tr class="border-b border-base-300">
					<td class="py-2 pr-4 font-medium">Right (OD)</td>
					<td class="py-2 pr-4">{fmtDioptres(data.rightEye.sphereDiopters)}</td>
					<td class="py-2 pr-4">{fmtDioptres(data.rightEye.cylinderDiopters)}</td>
					<td class="py-2 pr-4">{data.rightEye.axisDegrees ?? '—'}</td>
					<td class="py-2 pr-4">{fmtDioptres(data.rightEye.additionDiopters)}</td>
					<td class="py-2">{data.rightEye.prismHorizontalDiopters || data.rightEye.prismVerticalDiopters ? 'Yes' : '—'}</td>
				</tr>
				<tr>
					<td class="py-2 pr-4 font-medium">Left (OS)</td>
					<td class="py-2 pr-4">{fmtDioptres(data.leftEye.sphereDiopters)}</td>
					<td class="py-2 pr-4">{fmtDioptres(data.leftEye.cylinderDiopters)}</td>
					<td class="py-2 pr-4">{data.leftEye.axisDegrees ?? '—'}</td>
					<td class="py-2 pr-4">{fmtDioptres(data.leftEye.additionDiopters)}</td>
					<td class="py-2">{data.leftEye.prismHorizontalDiopters || data.leftEye.prismVerticalDiopters ? 'Yes' : '—'}</td>
				</tr>
			</tbody>
		</table>
		<p class="mt-3 text-sm text-base-content/70">
			<span class="font-medium">Anisometropia:</span>
			{result.anisometropia === null ? '—' : `${fmtDioptres(result.anisometropia)} D`}
			<span class="ml-4 font-medium">Presbyopia:</span> {classLabel(result.presbyopiaClass)}
			<span class="ml-4 font-medium">Lens:</span> {lensTypeLabel(data.lensRecommendation.lensType)}
		</p>
	</div>

	<!-- Flagged issues -->
	{#if result.additionalFlags.length > 0}
		<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-error">Safety flags for the prescriber</h2>
			<div class="space-y-2">
				{#each result.additionalFlags as flag (flag.flagId)}
					<div class="flex items-start gap-3 rounded-lg border p-3 {priorityColor(flag.priority)}">
						<span class="mt-0.5 rounded px-2 py-0.5 text-xs font-bold uppercase {priorityColor(flag.priority)}">
							{flag.priority}
						</span>
						<div>
							<span class="font-medium">{flag.category} ({flag.eye}):</span> {flag.description}
							<div class="text-xs italic opacity-80">{flag.suggestedAction}</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Fired rules -->
	{#if result.firedRules.length > 0}
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Classification justification</h2>
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-base-300 text-left text-base-content/70">
						<th class="pb-2 pr-4">Rule</th>
						<th class="pb-2 pr-4">Instrument</th>
						<th class="pb-2">Finding</th>
					</tr>
				</thead>
				<tbody>
					{#each result.firedRules as rule (rule.ruleId)}
						<tr class="border-b border-base-300">
							<td class="py-2 pr-4 font-mono text-xs text-base-content/60">{rule.ruleId}</td>
							<td class="py-2 pr-4">{rule.instrument}</td>
							<td class="py-2">{rule.description}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}

	<!-- Patient & prescriber summary -->
	<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
		<h2 class="mb-4 text-lg font-bold text-base-content">Prescription details</h2>
		<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
			<div><span class="font-medium text-base-content/70">Patient:</span> {data.patient.name || '—'}</div>
			<div>
				<span class="font-medium text-base-content/70">DOB:</span> {data.patient.birthDate || '—'}
				{#if age !== null}(Age {age}){/if}
			</div>
			<div><span class="font-medium text-base-content/70">Prescriber:</span> {data.prescriber.name || '—'}</div>
			<div><span class="font-medium text-base-content/70">GOC:</span> {data.prescriber.gocRegistrationNumber || '—'}</div>
			<div><span class="font-medium text-base-content/70">Issued:</span> {data.examination.issueDate || '—'}</div>
			<div><span class="font-medium text-base-content/70">Expires:</span> {data.examination.expiryDate || '—'}</div>
		</div>
	</div>
</main>
