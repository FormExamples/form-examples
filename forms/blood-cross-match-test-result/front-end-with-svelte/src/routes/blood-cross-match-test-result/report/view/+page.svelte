<script lang="ts">
	import { goto } from '$app/navigation';
	import { resultStore } from '$lib/stores/result.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import {
		resultClassificationLabel,
		resultClassificationColor,
		abnormalitySeverityLabel,
		abnormalitySeverityColor,
		followUpUrgencyLabel,
		followUpUrgencyColor,
		priorityColor,
		requestTypeLabel,
		reportStatusLabel,
		bloodGroupLabel,
		componentLabel,
		crossmatchResultLabel
	} from '$lib/engine/utils';

	const data = $derived(resultStore.data);
	const result = $derived(resultStore.result);

	$effect(() => {
		if (!resultStore.result) {
			goto('/blood-cross-match-test-result/report');
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch('/report/pdf', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: resultStore.data, result: resultStore.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `blood-cross-match-test-result-${new Date().toISOString().slice(0, 10)}.pdf`;
				a.click();
				URL.revokeObjectURL(url);
			} else {
				pdfError = 'Failed to generate PDF. Please try again.';
			}
		} catch {
			pdfError = 'Failed to generate PDF. Please check your connection and try again.';
		}
	}

	function structuredFindings() {
		const list: string[] = [];
		if (data.crossmatchResult === 'incompatible') list.push('Incompatible crossmatch');
		if (data.antibodyScreenResult === 'positive') list.push('Clinically-significant antibodies (positive screen)');
		if (data.aboGroup !== '' && !data.historicalGroupConcordant) list.push('ABO discrepancy (historical-group non-concordance)');
		if (!data.twoSampleRuleMet && (data.aboGroup !== '' || data.crossmatchResult !== '')) list.push('Two-sample group-check rule not met');
		if (
			data.unitsCrossmatched !== null &&
			data.unitsAvailable !== null &&
			data.unitsAvailable < data.unitsCrossmatched
		)
			list.push('Insufficient compatible units');
		return list;
	}
</script>

{#if result}
	<header class="border-b border-gray-200 bg-white shadow-sm no-print">
		<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
			<h1 class="text-lg font-bold text-gray-900">Blood cross-match report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-red-600">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto('/blood-cross-match-test-result/report')}>Edit</Button>
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-4xl px-4 py-6">
		<!-- Critical-result alert -->
		{#if result.followUpUrgency === 'critical-alert'}
			<Alert type="error" heading="Critical-result alert" class="mb-6">
				<p>
					This report contains a critical result. {data.criticalResultCommunicated
						? 'The result has been recorded as communicated.'
						: 'The result has NOT yet been recorded as communicated to the requester.'}
				</p>
			</Alert>
		{/if}

		<!-- Four-axis interpretation grade -->
		<div class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
			<div class="rounded-xl border border-gray-200 bg-white p-4 text-center">
				<div class="mb-2 text-xs font-semibold uppercase text-gray-500">Classification</div>
				<Badge
					label={resultClassificationLabel(result.resultClassification)}
					color={resultClassificationColor(result.resultClassification)}
				/>
			</div>
			<div class="rounded-xl border border-gray-200 bg-white p-4 text-center">
				<div class="mb-2 text-xs font-semibold uppercase text-gray-500">Severity</div>
				<Badge
					label={abnormalitySeverityLabel(result.abnormalitySeverity)}
					color={abnormalitySeverityColor(result.abnormalitySeverity)}
				/>
				{#if result.reportingCategory}
					<div class="mt-1 text-xs text-gray-500">{result.reportingCategory}</div>
				{/if}
			</div>
			<div class="rounded-xl border border-gray-200 bg-white p-4 text-center">
				<div class="mb-2 text-xs font-semibold uppercase text-gray-500">Completeness</div>
				<div class="text-2xl font-bold text-gray-900">{result.reportCompletenessPercent}%</div>
			</div>
			<div class="rounded-xl border border-gray-200 bg-white p-4 text-center">
				<div class="mb-2 text-xs font-semibold uppercase text-gray-500">Follow-up urgency</div>
				<Badge
					label={followUpUrgencyLabel(result.followUpUrgency)}
					color={followUpUrgencyColor(result.followUpUrgency)}
				/>
				<div class="mt-1 text-xs text-gray-500">{result.targetTimeframe}</div>
			</div>
		</div>

		<div class="mb-6 rounded-xl border border-gray-200 bg-white p-6">
			<h2 class="mb-2 text-lg font-bold text-gray-900">Recommendation</h2>
			<p class="text-sm text-gray-700">{result.recommendedAction}</p>
			<p class="mt-2 text-xs text-gray-500">
				Overall recommendation: <span class="font-semibold">{result.recommendation}</span> · Graded
				{new Date(result.gradedAt).toLocaleString()}
			</p>
		</div>

		<!-- Safety flags -->
		{#if result.flags.length > 0}
			<div class="mb-6 rounded-xl border border-red-200 bg-white p-6">
				<h2 class="mb-4 text-lg font-bold text-red-800">Safety flags</h2>
				<div class="space-y-2">
					{#each result.flags as flag (flag.flagId)}
						<div class="flex items-start gap-3 rounded-lg border p-3 {priorityColor(flag.priority)}">
							<span class="mt-0.5 rounded px-2 py-0.5 text-xs font-bold uppercase {priorityColor(flag.priority)}">
								{flag.priority}
							</span>
							<div>
								<span class="font-medium">{flag.category}:</span>
								{flag.description}
								<div class="mt-0.5 text-xs opacity-80">{flag.suggestedAction}</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Report body -->
		<div class="mb-6 rounded-xl border border-gray-200 bg-white p-6">
			<h2 class="mb-4 text-lg font-bold text-gray-900">Report</h2>
			<dl class="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
				<div><dt class="font-medium text-gray-600">Reporting clinician</dt><dd>{data.reportingClinician || 'N/A'}</dd></div>
				<div><dt class="font-medium text-gray-600">Originating request</dt><dd>{data.originatingRequestReference || 'N/A'}</dd></div>
				<div><dt class="font-medium text-gray-600">Request type</dt><dd>{requestTypeLabel(data.requestType)}</dd></div>
				<div><dt class="font-medium text-gray-600">Report status</dt><dd>{reportStatusLabel(data.reportStatus)}</dd></div>
				<div><dt class="font-medium text-gray-600">ABO / RhD group</dt><dd>{bloodGroupLabel(data.aboGroup, data.rhdGroup)}</dd></div>
				<div><dt class="font-medium text-gray-600">Antibody screen</dt><dd>{data.antibodyScreenResult || 'N/A'}</dd></div>
				<div><dt class="font-medium text-gray-600">Crossmatch</dt><dd>{crossmatchResultLabel(data.crossmatchResult)}</dd></div>
				<div><dt class="font-medium text-gray-600">Component</dt><dd>{componentLabel(data.component)}</dd></div>
				<div><dt class="font-medium text-gray-600">Units crossmatched</dt><dd>{data.unitsCrossmatched ?? 'N/A'}</dd></div>
				<div><dt class="font-medium text-gray-600">Units available</dt><dd>{data.unitsAvailable ?? 'N/A'}</dd></div>
				<div><dt class="font-medium text-gray-600">Two-sample rule met</dt><dd>{data.twoSampleRuleMet ? 'Yes' : 'No'}</dd></div>
				<div><dt class="font-medium text-gray-600">Historical group concordant</dt><dd>{data.historicalGroupConcordant ? 'Yes' : 'No'}</dd></div>
			</dl>

			<h3 class="mt-4 mb-1 font-semibold text-gray-700">Clinical history</h3>
			<p class="text-sm text-gray-700">{data.clinicalHistory || 'Not specified'}</p>

			<h3 class="mt-4 mb-1 font-semibold text-gray-700">Antibodies identified</h3>
			<p class="text-sm text-gray-700">{data.antibodiesIdentified || 'None'}</p>

			<h3 class="mt-4 mb-1 font-semibold text-gray-700">Special requirements</h3>
			<p class="text-sm text-gray-700">{data.specialRequirements || 'None'}</p>

			<h3 class="mt-4 mb-1 font-semibold text-gray-700">Findings</h3>
			<p class="text-sm text-gray-700">{data.findingsNarrative || 'Not specified'}</p>
			{#if structuredFindings().length > 0}
				<ul class="mt-2 list-disc pl-5 text-sm text-gray-700">
					{#each structuredFindings() as f (f)}
						<li>{f}</li>
					{/each}
				</ul>
			{/if}

			<h3 class="mt-4 mb-1 font-semibold text-gray-700">Impression</h3>
			<p class="text-sm text-gray-700">{data.impression || 'Not specified'}</p>
			<p class="mt-1 text-sm text-gray-600">Recommended follow-up: {data.recommendedFollowUp || 'None'}</p>
		</div>

		<!-- Fired rules -->
		{#if result.firedRules.length > 0}
			<div class="mb-6 rounded-xl border border-gray-200 bg-white p-6">
				<h2 class="mb-4 text-lg font-bold text-gray-900">Fired rules (audit trail)</h2>
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b text-left text-gray-600">
							<th class="pb-2 pr-4">Rule</th>
							<th class="pb-2 pr-4">Axis</th>
							<th class="pb-2">Description</th>
						</tr>
					</thead>
					<tbody>
						{#each result.firedRules as rule (rule.ruleId)}
							<tr class="border-b border-gray-100">
								<td class="py-2 pr-4 font-mono text-xs text-gray-500">{rule.ruleId}</td>
								<td class="py-2 pr-4">{rule.axis}</td>
								<td class="py-2">{rule.description}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</main>
{/if}
