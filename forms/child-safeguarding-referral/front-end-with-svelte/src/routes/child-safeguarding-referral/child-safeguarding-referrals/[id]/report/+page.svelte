<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import {
		statusLabel,
		statusColor,
		urgencyLabel,
		urgencyColor,
		urgencyPathway,
		priorityLabel,
		priorityColor,
		primaryCategoryLabel,
		consentStatusLabel,
		yesNoLabel,
		yesNoUnknownLabel
	} from '#lib/engine/utils.js';
	import Badge from '#lib/components/ui/Badge.svelte';
	import Button from '#lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/child-safeguarding-referral/child-safeguarding-referrals/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/child-safeguarding-referrals/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `child-safeguarding-referral-${data.child.childReference || id}.pdf`;
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
			<h1 class="text-lg font-bold text-base-content">Child safeguarding referral report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/child-safeguarding-referral/child-safeguarding-referrals/${id}`)}>
					Edit
				</Button>
			</div>
		</div>
	</header>

	<main class="mx-16 px-4 py-6">
		<!-- Urgency banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {urgencyColor(result.urgency)}">
			<div class="text-3xl font-bold">{urgencyLabel(result.urgency)}</div>
			<div class="mt-2 text-sm font-semibold">{urgencyPathway(result.urgency)}</div>
			<div class="mt-3 inline-flex flex-wrap items-center justify-center gap-3">
				<Badge label={statusLabel(result.status)} colorClass={statusColor(result.status)} />
				<span class="text-sm font-semibold">
					{result.completenessPercent}% complete · {result.satisfiedCount} of {result.mandatoryCount}
					mandatory requirements met
				</span>
			</div>
			<div class="mt-2 text-sm opacity-75">
				Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- Mandatory requirements -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Mandatory requirements</h2>
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-base-300 text-left text-base-content/70">
						<th class="pb-2 pr-4">Requirement</th>
						<th class="pb-2">Met</th>
					</tr>
				</thead>
				<tbody>
					{#each result.firedRules as rule (rule.id)}
						<tr class="border-b border-base-200 align-top">
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

		<!-- Safeguarding flags -->
		{#if result.flaggedIssues.length > 0}
			<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-error">
					Safeguarding flags ({result.flaggedIssues.length})
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

		<!-- Referral summary -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Referral summary</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div>
					<span class="font-medium text-base-content/70">Child:</span>
					{data.child.childName || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Date of birth / age:</span>
					{data.child.childDateOfBirth || (data.child.childAge != null ? `${data.child.childAge} yrs` : 'N/A')}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Primary category:</span>
					{primaryCategoryLabel(data.category.primaryCategory)}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Immediate danger:</span>
					{yesNoLabel(data.risk.immediateDanger) || 'Not recorded'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Alleged person in contact:</span>
					{yesNoUnknownLabel(data.risk.allegedPersonInContact) || 'Not recorded'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Other children at risk:</span>
					{yesNoUnknownLabel(data.risk.otherChildrenAtRisk) || 'Not recorded'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Consent status:</span>
					{consentStatusLabel(data.consent.consentStatus)}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Family aware:</span>
					{yesNoLabel(data.consent.familyAware) || 'Not recorded'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Referrer:</span>
					{data.referrer.referrerName || 'N/A'}
					{#if data.referrer.referrerRole}({data.referrer.referrerRole}){/if}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Action requested:</span>
					{data.action.requestedAction || 'N/A'}
				</div>
			</div>
			{#if data.concern.concernDescription}
				<div class="mt-4 text-sm">
					<span class="font-medium text-base-content/70">Concern:</span>
					<p class="mt-1 text-base-content/80">{data.concern.concernDescription}</p>
				</div>
			{/if}
			{#if data.action.notes}
				<div class="mt-4 text-sm">
					<span class="font-medium text-base-content/70">Notes:</span>
					<p class="mt-1 text-base-content/80">{data.action.notes}</p>
				</div>
			{/if}
		</div>
	</main>
{/if}
