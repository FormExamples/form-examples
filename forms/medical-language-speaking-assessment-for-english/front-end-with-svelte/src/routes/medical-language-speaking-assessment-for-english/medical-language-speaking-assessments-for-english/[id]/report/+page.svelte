<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import {
		gradeLabel,
		gradeColor,
		outcomeLabel,
		linguisticBandLabel,
		communicationBandLabel
	} from '$lib/engine/utils';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/medical-language-speaking-assessment-for-english/medical-language-speaking-assessments-for-english/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/medical-language-speaking-assessments-for-english/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `oet-speaking-assessment-${data.candidateDetails.lastName || id}.pdf`;
				a.click();
				URL.revokeObjectURL(url);
			} else {
				pdfError = 'Failed to generate PDF. Please try again.';
			}
		} catch {
			pdfError = 'Failed to generate PDF. Please check your connection and try again.';
		}
	}

	const priorityColor: Record<string, string> = {
		high: 'bg-error text-error-content border-error',
		medium: 'bg-warning text-warning-content border-warning',
		low: 'bg-base-300 text-base-content border-base-300'
	};

	const linguisticRows = $derived([
		{ label: 'Intelligibility', value: data.linguisticCriteria.intelligibility },
		{ label: 'Fluency', value: data.linguisticCriteria.fluency },
		{ label: 'Appropriateness of language', value: data.linguisticCriteria.appropriatenessOfLanguage },
		{ label: 'Resources of grammar & expression', value: data.linguisticCriteria.resourcesOfGrammarAndExpression }
	]);

	const communicationRows = $derived([
		{ label: 'Relationship-building', value: data.clinicalCommunication.relationshipBuilding },
		{ label: "Understanding patient's perspective", value: data.clinicalCommunication.understandingPatientPerspective },
		{ label: 'Providing structure', value: data.clinicalCommunication.providingStructure },
		{ label: 'Information-gathering', value: data.clinicalCommunication.informationGathering },
		{ label: 'Information-giving', value: data.clinicalCommunication.informationGiving }
	]);
</script>

{#if result}
	<header class="border-b border-base-300 bg-base-100 shadow-sm no-print">
		<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
			<h1 class="text-lg font-bold text-base-content">OET speaking assessment report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/medical-language-speaking-assessment-for-english/medical-language-speaking-assessments-for-english/${id}`)}>Edit</Button>
			</div>
		</div>
	</header>

	<main class="mx-16 px-4 py-6">
		<!-- Overall grade banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {gradeColor(result.grade)}">
			<div class="text-3xl font-bold">{result.score} / 500</div>
			<div class="mt-1 text-xl font-semibold">{gradeLabel(result.grade)}</div>
			<div class="mt-2 flex justify-center gap-6 text-sm">
				<span>Linguistic: {result.linguisticTotal} / {result.linguisticMax}</span>
				<span>Communication: {result.communicationTotal} / {result.communicationMax}</span>
				<span>Outcome: {outcomeLabel(result.outcome)}</span>
			</div>
			<div class="mt-2 text-sm opacity-75">
				Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- Flagged issues -->
		{#if result.additionalFlags.length > 0}
			<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-error">Flagged issues for the assessment lead</h2>
				<div class="space-y-2">
					{#each result.additionalFlags as flag (flag.id)}
						<div class="flex items-start gap-3 rounded-lg border p-3 {priorityColor[flag.priority]}">
							<span class="mt-0.5 rounded px-2 py-0.5 text-xs font-bold uppercase {priorityColor[flag.priority]}">
								{flag.priority}
							</span>
							<div><span class="font-medium">{flag.category}:</span> {flag.message}</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Criterion scores -->
		<div class="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
			<div class="rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Linguistic criteria (0-6)</h2>
				<ul class="space-y-1 text-sm text-base-content/80">
					{#each linguisticRows as row (row.label)}
						<li class="flex justify-between gap-4">
							<span>{row.label}</span>
							<span class="font-medium">{linguisticBandLabel(row.value)}</span>
						</li>
					{/each}
				</ul>
			</div>
			<div class="rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Clinical communication (0-3)</h2>
				<ul class="space-y-1 text-sm text-base-content/80">
					{#each communicationRows as row (row.label)}
						<li class="flex justify-between gap-4">
							<span>{row.label}</span>
							<span class="font-medium">{communicationBandLabel(row.value)}</span>
						</li>
					{/each}
				</ul>
			</div>
		</div>

		<!-- Fired rules -->
		{#if result.firedRules.length > 0}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Criterion weaknesses</h2>
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b border-base-300 text-left text-base-content/70">
							<th class="pb-2 pr-4">Rule</th>
							<th class="pb-2 pr-4">Criterion</th>
							<th class="pb-2 pr-4">Finding</th>
							<th class="pb-2">Severity</th>
						</tr>
					</thead>
					<tbody>
						{#each result.firedRules as rule (rule.id)}
							<tr class="border-b border-base-200">
								<td class="py-2 pr-4 font-mono text-xs text-base-content/60">{rule.id}</td>
								<td class="py-2 pr-4">{rule.criterion}</td>
								<td class="py-2 pr-4">{rule.description}</td>
								<td class="py-2"><Badge grade={rule.grade} /></td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}

		<!-- Candidate summary -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Candidate summary</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div><span class="font-medium text-base-content/70">Name:</span> {data.candidateDetails.firstName} {data.candidateDetails.lastName}</div>
				<div><span class="font-medium text-base-content/70">Candidate no.:</span> {data.candidateDetails.candidateNumber || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Profession:</span> {data.candidateDetails.profession || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">First language:</span> {data.candidateDetails.firstLanguage || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Date of test:</span> {data.candidateDetails.dateOfTest || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Assessor:</span> {data.candidateDetails.assessorName || 'N/A'}</div>
			</div>
		</div>

		<!-- Examiner comments -->
		{#if data.clinicalCommunication.examinerComments}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Examiner comments</h2>
				<p class="text-sm text-base-content/80">{data.clinicalCommunication.examinerComments}</p>
			</div>
		{/if}
	</main>
{/if}
