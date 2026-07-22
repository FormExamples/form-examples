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
		specimenTypeLabel,
		cultureResultLabel,
		reportStatusLabel
	} from '$lib/engine/utils';

	const data = $derived(resultStore.data);
	const result = $derived(resultStore.result);

	$effect(() => {
		if (!resultStore.result) {
			goto('/microbiology-culture-test-result/report');
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
				a.download = `microbiology-culture-test-result-${new Date().toISOString().slice(0, 10)}.pdf`;
				a.click();
				URL.revokeObjectURL(url);
			} else {
				pdfError = 'Failed to generate PDF. Please try again.';
			}
		} catch {
			pdfError = 'Failed to generate PDF. Please check your connection and try again.';
		}
	}

	function resistanceFindings() {
		const list: string[] = [];
		if (data.resistanceMrsa) list.push('MRSA detected');
		if (data.resistanceEsbl) list.push('ESBL producer detected');
		if (data.resistanceCpe) list.push('CPE detected');
		if (data.cDifficileToxin && data.cDifficileToxin !== 'not-tested')
			list.push(`C. difficile toxin: ${data.cDifficileToxin}`);
		if (data.acidFastBacilli && data.acidFastBacilli !== 'not-tested')
			list.push(`Acid-fast bacilli: ${data.acidFastBacilli}`);
		if (data.criticalOrganism) list.push('Critical / alert organism flagged');
		return list;
	}
</script>

{#if result}
	<header class="border-b border-gray-200 bg-white shadow-sm no-print">
		<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
			<h1 class="text-lg font-bold text-gray-900">Microbiology culture report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-red-600">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto('/microbiology-culture-test-result/report')}>Edit</Button>
			</div>
		</div>
	</header>

	<main class="mx-16 px-4 py-6">
		<!-- Critical-result alert -->
		{#if result.followUpUrgency === 'critical-alert'}
			<Alert type="error" heading="Critical-result alert" class="mb-6">
				<p>
					This report contains a critical organism / result. {data.criticalResultCommunicated
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
				<div><dt class="font-medium text-gray-600">Specimen type</dt><dd>{specimenTypeLabel(data.specimenType)}</dd></div>
				<div><dt class="font-medium text-gray-600">Report status</dt><dd>{reportStatusLabel(data.reportStatus)}</dd></div>
				<div><dt class="font-medium text-gray-600">Specimen condition</dt><dd>{data.specimenCondition || 'N/A'}</dd></div>
				<div><dt class="font-medium text-gray-600">Culture result</dt><dd>{cultureResultLabel(data.cultureResult)}</dd></div>
				<div><dt class="font-medium text-gray-600">Organism isolated</dt><dd>{data.organismIsolated || 'N/A'}</dd></div>
				<div><dt class="font-medium text-gray-600">Colony count</dt><dd>{data.colonyCount || 'N/A'}</dd></div>
			</dl>

			<h3 class="mt-4 mb-1 font-semibold text-gray-700">Clinical history</h3>
			<p class="text-sm text-gray-700">{data.clinicalHistory || 'Not specified'}</p>

			<h3 class="mt-4 mb-1 font-semibold text-gray-700">Gram stain</h3>
			<p class="text-sm text-gray-700">{data.gramStainResult || 'Not specified'}</p>

			<h3 class="mt-4 mb-1 font-semibold text-gray-700">Antibiotic sensitivities</h3>
			<p class="text-sm text-gray-700">{data.antibioticSensitivities || 'Not specified'}</p>
			{#if resistanceFindings().length > 0}
				<ul class="mt-2 list-disc pl-5 text-sm text-gray-700">
					{#each resistanceFindings() as f (f)}
						<li>{f}</li>
					{/each}
				</ul>
			{/if}

			<h3 class="mt-4 mb-1 font-semibold text-gray-700">Findings</h3>
			<p class="text-sm text-gray-700">{data.findingsNarrative || 'Not specified'}</p>

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
