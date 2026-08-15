<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import {
		statusLabel,
		statusColor,
		priorityLabel,
		priorityColor,
		priorityBalanceLabel,
		cprRecommendationLabel,
		cprRecommendationColor,
		ceilingLabel,
		involvementLabel,
		clinicianRoleLabel,
		yesNoLabel
	} from '#lib/engine/utils.js';
	import Badge from '#lib/components/ui/Badge.svelte';
	import Button from '#lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/recommended-summary-plan-for-emergency-care-and-treatment/plans/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/plans/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `respect-plan-${data.personal.identifier || id}.pdf`;
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

{#if result}
	<header class="border-b border-base-300 bg-base-100 shadow-sm no-print">
		<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
			<h1 class="text-lg font-bold text-base-content">ReSPECT plan report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/recommended-summary-plan-for-emergency-care-and-treatment/plans/${id}`)}>Edit</Button>
			</div>
		</div>
	</header>

	<main class="mx-16 px-4 py-6">
		<!-- Status banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {statusColor(result.status)}">
			<div class="text-3xl font-bold">Plan {statusLabel(result.status)}</div>
			<div class="mt-2 text-sm font-semibold">
				{result.completenessPercent}% complete · {result.satisfiedCount} of {result.mandatoryCount}
				mandatory rules satisfied
			</div>
			<div class="mt-2 text-sm opacity-75">
				Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- CPR recommendation -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-2 text-lg font-bold text-base-content">CPR recommendation</h2>
			<div class="mb-3">
				<Badge
					label={cprRecommendationLabel(data.cpr.cprRecommendation)}
					colorClass={cprRecommendationColor(data.cpr.cprRecommendation)}
				/>
			</div>
			<p class="text-sm text-base-content/80">
				<span class="font-medium text-base-content/70">Rationale:</span>
				{data.cpr.cprRationale || 'Not recorded'}
			</p>
			<p class="mt-1 text-sm text-base-content/80">
				<span class="font-medium text-base-content/70">Discussed with person / proxy:</span>
				{yesNoLabel(data.cpr.cprDiscussed) || 'Not recorded'}
			</p>
		</div>

		<!-- Mandatory rules -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Mandatory rules</h2>
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-base-300 text-left text-base-content/70">
						<th class="pb-2 pr-4">Rule</th>
						<th class="pb-2 pr-4">Requirement</th>
						<th class="pb-2">Met</th>
					</tr>
				</thead>
				<tbody>
					{#each result.firedRules as rule (rule.id)}
						<tr class="border-b border-base-200 align-top">
							<td class="py-2 pr-4 font-medium">{rule.category}</td>
							<td class="py-2 pr-4">{rule.description}</td>
							<td class="py-2">
								<span
									class="rounded-full border px-2 py-0.5 text-xs font-bold {rule.satisfied
										? 'bg-success text-success-content border-success'
										: 'bg-error text-error-content border-error'}"
								>
									{rule.satisfied ? 'Yes' : 'No'}
								</span>
							</td>
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

		<!-- Plan summary -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Plan summary</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div>
					<span class="font-medium text-base-content/70">Person:</span>
					{data.personal.personName || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Date of birth:</span>
					{data.personal.dateOfBirth || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Identifier:</span>
					{data.personal.identifier || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Balance of priorities:</span>
					{priorityBalanceLabel(data.recommendations.priorityBalance) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Hospital transfer:</span>
					{ceilingLabel(data.ceilings.hospitalTransfer)}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Critical-care admission:</span>
					{ceilingLabel(data.ceilings.criticalCareAdmission)}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Has capacity:</span>
					{yesNoLabel(data.capacity.hasCapacity) || 'Not recorded'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Involvement:</span>
					{involvementLabel(data.capacity.involvement) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Clinician:</span>
					{data.signOff.clinicianName || 'N/A'}
					{#if clinicianRoleLabel(data.signOff.clinicianRole)}
						({clinicianRoleLabel(data.signOff.clinicianRole)})
					{/if}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Review date:</span>
					{data.signOff.reviewDate || 'N/A'}
				</div>
			</div>
			{#if data.note}
				<div class="mt-4 text-sm">
					<span class="font-medium text-base-content/70">Clinician note:</span>
					<p class="mt-1 text-base-content/80">{data.note}</p>
				</div>
			{/if}
		</div>
	</main>
{/if}
