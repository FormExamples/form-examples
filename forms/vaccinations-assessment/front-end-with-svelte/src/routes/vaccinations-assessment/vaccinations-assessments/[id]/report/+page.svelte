<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import {
		vaccinationLevelLabel,
		vaccinationLevelColor,
		formatDate,
		formatNhsNumber,
		childhoodScore,
		adultScore,
		consentScore
	} from '$lib/engine/utils';
	import Button from '$lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/vaccinations-assessment/vaccinations-assessments/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/vaccinations-assessments/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `vaccinations-assessment-${data.patientInformation.patientName || id}.pdf`;
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

	const concernColor: Record<string, string> = {
		high: 'bg-error text-error-content',
		medium: 'bg-warning text-warning-content',
		low: 'bg-base-300 text-base-content'
	};

	function scoreDisplay(val: number | null): string {
		if (val === null) return 'N/A';
		return val + '%';
	}
</script>

{#if result}
	<header class="border-b border-base-300 bg-base-100 shadow-sm no-print">
		<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
			<h1 class="text-lg font-bold text-base-content">Vaccination compliance report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/vaccinations-assessment/vaccinations-assessments/${id}`)}>Edit</Button>
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-4xl px-4 py-6">
		<!-- Vaccination level banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {vaccinationLevelColor(result.vaccinationLevel)}">
			<div class="text-3xl font-bold">{result.vaccinationScore}%</div>
			<div class="mt-1 text-lg">{vaccinationLevelLabel(result.vaccinationLevel)}</div>
			<div class="mt-2 text-sm opacity-75">
				Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- Dimension scores -->
		<div class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
			<div class="rounded-xl border border-base-300 bg-base-100 p-4 text-center">
				<div class="text-2xl font-bold text-base-content">{scoreDisplay(childhoodScore(data))}</div>
				<div class="mt-1 text-sm text-base-content/70">Childhood vaccinations</div>
			</div>
			<div class="rounded-xl border border-base-300 bg-base-100 p-4 text-center">
				<div class="text-2xl font-bold text-base-content">{scoreDisplay(adultScore(data))}</div>
				<div class="mt-1 text-sm text-base-content/70">Adult vaccinations</div>
			</div>
			<div class="rounded-xl border border-base-300 bg-base-100 p-4 text-center">
				<div class="text-2xl font-bold text-base-content">{scoreDisplay(consentScore(data))}</div>
				<div class="mt-1 text-sm text-base-content/70">Consent quality</div>
			</div>
		</div>

		<!-- Flagged issues -->
		{#if result.additionalFlags.length > 0}
			<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-error">Flagged issues for review</h2>
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

		<!-- Fired rules -->
		{#if result.firedRules.length > 0}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Vaccination concerns ({result.firedRules.length})</h2>
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b border-base-300 text-left text-base-content/70">
							<th class="pb-2 pr-4">Rule</th>
							<th class="pb-2 pr-4">Category</th>
							<th class="pb-2 pr-4">Concern</th>
							<th class="pb-2">Description</th>
						</tr>
					</thead>
					<tbody>
						{#each result.firedRules as rule (rule.id)}
							<tr class="border-b border-base-200">
								<td class="py-2 pr-4 font-mono text-xs text-base-content/60">{rule.id}</td>
								<td class="py-2 pr-4">{rule.category}</td>
								<td class="py-2 pr-4">
									<span class="rounded px-2 py-0.5 text-xs font-bold {concernColor[rule.concernLevel]}">
										{rule.concernLevel}
									</span>
								</td>
								<td class="py-2">{rule.description}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}

		<!-- Patient details -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Patient details</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div><span class="font-medium text-base-content/70">Name:</span> {data.patientInformation.patientName || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">DOB:</span> {formatDate(data.patientInformation.dateOfBirth)}</div>
				<div><span class="font-medium text-base-content/70">Sex:</span> {data.patientInformation.patientSex || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Age:</span> {data.patientInformation.patientAge || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">NHS Number:</span> {formatNhsNumber(data.patientInformation.nhsNumber)}</div>
				<div><span class="font-medium text-base-content/70">GP Practice:</span> {data.patientInformation.gpPractice || 'N/A'}</div>
			</div>
		</div>
	</main>
{/if}
