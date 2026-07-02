<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import {
		outcomeLabel,
		outcomeColor,
		referralLabel,
		recallIntervalLabel,
		retinopathyLabel,
		maculopathyLabel,
		photocoagulationLabel,
		ungradableLabel,
		statusLabel,
		priorityLabel,
		priorityColor,
		graderRoleLabel,
		imagingMediaLabel,
		ageBandLabel,
		diabetesTypeLabel
	} from '$lib/engine/utils';
	import Button from '$lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/diabetic-eye-screenings/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/diabetic-eye-screenings/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `diabetic-eye-screening-${data.identification.patientIdentifier || id}.pdf`;
				a.click();
				URL.revokeObjectURL(url);
			} else {
				pdfError = 'Failed to generate PDF. Please try again.';
			}
		} catch {
			pdfError = 'Failed to generate PDF. Please check your connection and try again.';
		}
	}

	const outcomeRows = $derived(
		result
			? [
					{ label: 'Recall interval', value: recallIntervalLabel(result.recallIntervalMonths) },
					{ label: 'Referral', value: referralLabel(result.referral) || 'N/A' },
					{ label: 'Worst-eye retinopathy', value: retinopathyLabel(result.worstRetinopathy) || result.worstRetinopathy },
					{ label: 'Worst-eye maculopathy', value: maculopathyLabel(result.worstMaculopathy) || result.worstMaculopathy },
					{ label: 'Any eye ungradable', value: result.anyUngradable ? 'Yes' : 'No' }
				]
			: []
	);
</script>

{#if result}
	<header class="border-b border-base-300 bg-base-100 shadow-sm no-print">
		<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
			<h1 class="text-lg font-bold text-base-content">Diabetic eye screening report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/diabetic-eye-screenings/${id}`)}
					>Edit</Button
				>
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-4xl px-4 py-6">
		<!-- Outcome banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {outcomeColor(result.recallPathway)}">
			<div class="text-3xl font-bold">{outcomeLabel(result.recallPathway)}</div>
			<div class="mt-2 text-sm font-semibold">
				{referralLabel(result.referral)} · {recallIntervalLabel(result.recallIntervalMonths)} · {statusLabel(
					result.status
				)}
			</div>
			<div class="mt-2 text-sm opacity-75">
				Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- Interpretation -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-2 text-lg font-bold text-base-content">Interpretation</h2>
			{#if result.recallPathway === 'refer-hes-urgent'}
				<p class="text-sm text-base-content/80">
					Worst-eye active proliferative retinopathy (R3A) — <strong>urgent / fast-track referral
					to ophthalmology</strong>. Action the referral within its local timeframe. A screening
					classification is not a diagnosis.
				</p>
			{:else if result.recallPathway === 'refer-hes'}
				<p class="text-sm text-base-content/80">
					Referable disease — maculopathy (M1) or stable proliferative retinopathy (R3S) —
					<strong>routine referral to the hospital eye service</strong>.
				</p>
			{:else if result.recallPathway === 'refer-slit-lamp'}
				<p class="text-sm text-base-content/80">
					An eye is ungradable with no referable disease elsewhere — <strong>re-screen or refer for
					slit-lamp biomicroscopy</strong> to obtain a gradable assessment.
				</p>
			{:else if result.recallPathway === 'surveillance-6-month'}
				<p class="text-sm text-base-content/80">
					Pre-proliferative retinopathy (R2) — <strong>6-monthly digital surveillance</strong>.
					Monitor for progression.
				</p>
			{:else if result.recallPathway === 'routine-24-month'}
				<p class="text-sm text-base-content/80">
					No retinopathy either eye and a low-risk prior screen — <strong>routine 24-monthly
					(extended) screening</strong>. A negative screen does not exclude future disease.
				</p>
			{:else if result.status === 'incomplete'}
				<p class="text-sm text-base-content/80">
					This record is <strong>incomplete</strong>: an eye is missing its R or M grade and is not
					marked ungradable. Complete the outstanding grade(s) so the outcome does not understate
					risk.
				</p>
			{:else}
				<p class="text-sm text-base-content/80">
					Background or no retinopathy — <strong>routine 12-monthly digital screening</strong>. A
					screening classification is not a diagnosis.
				</p>
			{/if}
		</div>

		<!-- Per-eye grading -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Per-eye grading</h2>
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-base-300 text-left text-base-content/70">
						<th class="py-2 pr-4">Eye</th>
						<th class="py-2 pr-4">Retinopathy (R)</th>
						<th class="py-2 pr-4">Maculopathy (M)</th>
						<th class="py-2 pr-4">Photocoagulation (P)</th>
						<th class="py-2">Ungradable (U)</th>
					</tr>
				</thead>
				<tbody>
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4 font-medium">Right</td>
						<td class="py-2 pr-4">{retinopathyLabel(data.rightEye.retinopathy) || '—'}</td>
						<td class="py-2 pr-4">{maculopathyLabel(data.rightEye.maculopathy) || '—'}</td>
						<td class="py-2 pr-4">{photocoagulationLabel(data.rightEye.photocoagulation) || '—'}</td>
						<td class="py-2">{ungradableLabel(data.rightEye.ungradable) || '—'}</td>
					</tr>
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4 font-medium">Left</td>
						<td class="py-2 pr-4">{retinopathyLabel(data.leftEye.retinopathy) || '—'}</td>
						<td class="py-2 pr-4">{maculopathyLabel(data.leftEye.maculopathy) || '—'}</td>
						<td class="py-2 pr-4">{photocoagulationLabel(data.leftEye.photocoagulation) || '—'}</td>
						<td class="py-2">{ungradableLabel(data.leftEye.ungradable) || '—'}</td>
					</tr>
				</tbody>
			</table>
		</div>

		<!-- Outcome detail -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Outcome</h2>
			<table class="w-full text-sm">
				<tbody>
					{#each outcomeRows as row (row.label)}
						<tr class="border-b border-base-200">
							<td class="py-2 pr-4 text-base-content/70">{row.label}</td>
							<td class="py-2 font-medium">{row.value}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<!-- Flagged issues -->
		{#if result.flaggedIssues.length > 0}
			<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-error">
					Flagged issues ({result.flaggedIssues.length})
				</h2>
				<div class="space-y-2">
					{#each result.flaggedIssues as flag (flag.id)}
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
								{flag.description} — {flag.suggestedAction}
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Patient / context summary -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Screening summary</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div>
					<span class="font-medium text-base-content/70">Patient ID:</span>
					{data.identification.patientIdentifier || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Age band:</span>
					{ageBandLabel(data.identification.ageBand) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Diabetes type:</span>
					{diabetesTypeLabel(data.identification.diabetesType) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Years since diagnosis:</span>
					{data.identification.yearsSinceDiagnosis !== null
						? data.identification.yearsSinceDiagnosis
						: 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Grader:</span>
					{data.context.graderName || 'N/A'}
					{#if graderRoleLabel(data.context.graderRole)}
						({graderRoleLabel(data.context.graderRole)})
					{/if}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Imaging media:</span>
					{imagingMediaLabel(data.context.imagingMedia) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Graded:</span>
					{data.context.gradedAt || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Images captured:</span>
					{data.context.imageCapturedAt || 'N/A'}
				</div>
			</div>
			{#if data.note.clinicalContext}
				<div class="mt-4 text-sm">
					<span class="font-medium text-base-content/70">Clinical note:</span>
					<p class="mt-1 text-base-content/80">{data.note.clinicalContext}</p>
				</div>
			{/if}
		</div>
	</main>
{/if}
