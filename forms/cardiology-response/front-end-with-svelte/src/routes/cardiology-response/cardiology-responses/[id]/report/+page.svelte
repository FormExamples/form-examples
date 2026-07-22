<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { resultStore } from '$lib/stores/result.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import {
		responseClassificationLabel,
		responseClassificationColor,
		severityLabel,
		severityColor,
		followUpUrgencyLabel,
		followUpUrgencyColor,
		priorityColor,
		consultationTypeLabel,
		responseStatusLabel,
		primaryDiagnosisCategoryLabel
	} from '$lib/engine/utils';

	const id = $derived(page.params.id);
	const data = $derived(resultStore.data);
	const result = $derived(resultStore.result);

	$effect(() => {
		if (!resultStore.result) {
			goto(`/cardiology-response/cardiology-responses/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/cardiology-responses/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: resultStore.data, result: resultStore.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `cardiology-response-${new Date().toISOString().slice(0, 10)}.pdf`;
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
		if (data.ischaemiaOrCad) list.push('Ischaemia or coronary artery disease');
		if (data.significantArrhythmia) list.push('Significant arrhythmia');
		if (data.reducedEjectionFraction) list.push('Reduced ejection fraction');
		if (data.significantValveDisease) list.push('Significant valve disease');
		if (data.structuralAbnormality) list.push('Structural abnormality');
		if (data.uncontrolledHypertension) list.push('Uncontrolled hypertension');
		if (data.nonCardiacCause) list.push('Non-cardiac cause');
		return list;
	}
</script>

{#if result}
	<header class="border-b border-base-300 bg-base-100 shadow-sm no-print">
		<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
			<h1 class="text-lg font-bold text-base-content">Cardiology response</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/cardiology-response/cardiology-responses/${id}`)}>Edit</Button>
			</div>
		</div>
	</header>

	<main class="mx-16 px-4 py-6">
		<!-- Critical-result alert -->
		{#if result.followUpUrgency === 'critical-alert'}
			<Alert type="error" heading="Critical-result alert" class="mb-6">
				<p>
					This response contains a critical result. {data.criticalResultCommunicated
						? 'The result has been recorded as communicated to the referrer.'
						: 'The result has NOT yet been recorded as communicated to the referrer.'}
				</p>
			</Alert>
		{/if}

		<!-- Four-axis interpretation grade -->
		<div class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
			<div class="rounded-xl border border-base-300 bg-base-100 p-4 text-center">
				<div class="mb-2 text-xs font-semibold uppercase text-base-content/60">Classification</div>
				<Badge
					label={responseClassificationLabel(result.responseClassification)}
					color={responseClassificationColor(result.responseClassification)}
				/>
			</div>
			<div class="rounded-xl border border-base-300 bg-base-100 p-4 text-center">
				<div class="mb-2 text-xs font-semibold uppercase text-base-content/60">Severity</div>
				<Badge label={severityLabel(result.severity)} color={severityColor(result.severity)} />
				{#if result.severityCategory}
					<div class="mt-1 text-xs text-base-content/60">{result.severityCategory}</div>
				{/if}
			</div>
			<div class="rounded-xl border border-base-300 bg-base-100 p-4 text-center">
				<div class="mb-2 text-xs font-semibold uppercase text-base-content/60">Completeness</div>
				<div class="text-2xl font-bold text-base-content">{result.completenessPercent}%</div>
			</div>
			<div class="rounded-xl border border-base-300 bg-base-100 p-4 text-center">
				<div class="mb-2 text-xs font-semibold uppercase text-base-content/60">Follow-up urgency</div>
				<Badge
					label={followUpUrgencyLabel(result.followUpUrgency)}
					color={followUpUrgencyColor(result.followUpUrgency)}
				/>
				<div class="mt-1 text-xs text-base-content/60">{result.targetTimeframe}</div>
			</div>
		</div>

		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-2 text-lg font-bold text-base-content">Recommendation</h2>
			<p class="text-sm text-base-content/80">{result.recommendedAction}</p>
			<p class="mt-2 text-xs text-base-content/60">
				Overall recommendation: <span class="font-semibold">{result.recommendation}</span> · Graded
				{new Date(result.gradedAt).toLocaleString()}
			</p>
		</div>

		<!-- Safety flags -->
		{#if result.flags.length > 0}
			<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-error">Safety flags</h2>
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

		<!-- Response body -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Response</h2>
			<dl class="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
				<div><dt class="font-medium text-base-content/70">Responding clinician</dt><dd>{data.respondingClinician || 'N/A'}</dd></div>
				<div><dt class="font-medium text-base-content/70">Originating request</dt><dd>{data.originatingRequestReference || 'N/A'}</dd></div>
				<div><dt class="font-medium text-base-content/70">Patient</dt><dd>{data.patientName || 'N/A'}</dd></div>
				<div><dt class="font-medium text-base-content/70">NHS number</dt><dd>{data.patientNhsNumber || 'N/A'}</dd></div>
				<div><dt class="font-medium text-base-content/70">Consultation type</dt><dd>{consultationTypeLabel(data.consultationType)}</dd></div>
				<div><dt class="font-medium text-base-content/70">Response status</dt><dd>{responseStatusLabel(data.responseStatus)}</dd></div>
				<div><dt class="font-medium text-base-content/70">Primary diagnosis</dt><dd>{primaryDiagnosisCategoryLabel(data.primaryDiagnosisCategory)}</dd></div>
				<div><dt class="font-medium text-base-content/70">LV ejection fraction</dt><dd>{data.lvEjectionFractionPercent !== null ? `${data.lvEjectionFractionPercent}%` : 'N/A'}</dd></div>
			</dl>

			<h3 class="mt-4 mb-1 font-semibold text-base-content/80">Clinical assessment</h3>
			<p class="text-sm text-base-content/80">{data.clinicalSummary || 'Not specified'}</p>
			<p class="mt-1 text-sm text-base-content/70">Examination: {data.examinationFindings || 'None recorded'}</p>
			<p class="mt-1 text-sm text-base-content/70">Investigations: {data.investigationsPerformed || 'None recorded'}</p>

			<h3 class="mt-4 mb-1 font-semibold text-base-content/80">Structured findings</h3>
			{#if structuredFindings().length > 0}
				<ul class="list-disc pl-5 text-sm text-base-content/80">
					{#each structuredFindings() as f (f)}
						<li>{f}</li>
					{/each}
				</ul>
			{:else}
				<p class="text-sm text-base-content/80">No structured findings.</p>
			{/if}

			<h3 class="mt-4 mb-1 font-semibold text-base-content/80">Diagnosis</h3>
			<p class="text-sm text-base-content/80">{data.diagnosisNarrative || 'Not specified'}</p>

			<h3 class="mt-4 mb-1 font-semibold text-base-content/80">Management & follow-up</h3>
			<p class="text-sm text-base-content/80">{data.managementPlan || 'Not specified'}</p>
			<p class="mt-1 text-sm text-base-content/70">Medication changes: {data.medicationChanges || 'None'}</p>
			<p class="mt-1 text-sm text-base-content/70">Recommended follow-up: {data.recommendedFollowUp || 'None'}</p>
		</div>

		<!-- Fired rules -->
		{#if result.firedRules.length > 0}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Fired rules (audit trail)</h2>
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b text-left text-base-content/70">
							<th class="pb-2 pr-4">Rule</th>
							<th class="pb-2 pr-4">Axis</th>
							<th class="pb-2">Description</th>
						</tr>
					</thead>
					<tbody>
						{#each result.firedRules as rule (rule.ruleId)}
							<tr class="border-b border-base-200">
								<td class="py-2 pr-4 font-mono text-xs text-base-content/60">{rule.ruleId}</td>
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
