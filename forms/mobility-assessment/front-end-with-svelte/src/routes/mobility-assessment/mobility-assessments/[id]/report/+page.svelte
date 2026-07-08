<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import {
		tinettiScoreColor,
		tugCategory,
		tugScoreColor,
		calculateAge
	} from '$lib/engine/utils';
	import Button from '$lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/mobility-assessment/mobility-assessments/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/mobility-assessments/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `mobility-assessment-${data.demographics.lastName || id}.pdf`;
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
</script>

{#if result}
	<header class="border-b border-base-300 bg-base-100 shadow-sm no-print">
		<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
			<h1 class="text-lg font-bold text-base-content">Mobility assessment report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/mobility-assessment/mobility-assessments/${id}`)}>Edit</Button>
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-4xl px-4 py-6">
		<!-- Tinetti score banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {tinettiScoreColor(result.tinettiTotal)}">
			<div class="text-3xl font-bold">Tinetti {result.tinettiTotal}/28</div>
			<div class="mt-1 text-lg">Balance: {result.balanceScore}/16 | Gait: {result.gaitScore}/12</div>
			<div class="mt-1 text-lg font-semibold">{result.tinettiCategory}</div>
			<div class="mt-2 text-sm opacity-75">
				Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- TUG result -->
		{#if data.timedUpAndGo.timeSeconds !== null}
			<div class="mb-6 rounded-xl border-2 p-4 text-center {tugScoreColor(data.timedUpAndGo.timeSeconds)}">
				<div class="text-xl font-bold">TUG: {data.timedUpAndGo.timeSeconds}s</div>
				<div class="text-sm">{tugCategory(data.timedUpAndGo.timeSeconds)}</div>
			</div>
		{/if}

		<!-- Flagged issues -->
		{#if result.additionalFlags.length > 0}
			<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-error">Flagged issues for clinician</h2>
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

		<!-- Tinetti breakdown -->
		{#if result.firedRules.length > 0}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Tinetti score breakdown</h2>
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b border-base-300 text-left text-base-content/70">
							<th class="pb-2 pr-4">Item</th>
							<th class="pb-2 pr-4">Domain</th>
							<th class="pb-2 pr-4">Description</th>
							<th class="pb-2">Score</th>
						</tr>
					</thead>
					<tbody>
						{#each result.firedRules as rule (rule.id)}
							<tr class="border-b border-base-200">
								<td class="py-2 pr-4 font-mono text-xs text-base-content/60">{rule.id}</td>
								<td class="py-2 pr-4">{rule.domain}</td>
								<td class="py-2 pr-4">{rule.description}</td>
								<td class="py-2 font-bold">{rule.score}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}

		<!-- Patient summary -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Patient summary</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div><span class="font-medium text-base-content/70">Name:</span> {data.demographics.firstName} {data.demographics.lastName}</div>
				<div>
					<span class="font-medium text-base-content/70">DOB:</span> {data.demographics.dateOfBirth}
					{#if calculateAge(data.demographics.dateOfBirth)}(Age {calculateAge(data.demographics.dateOfBirth)}){/if}
				</div>
				<div><span class="font-medium text-base-content/70">Sex:</span> {data.demographics.sex}</div>
				<div><span class="font-medium text-base-content/70">Referring provider:</span> {data.referralInfo.referringProvider || 'N/A'}</div>
				<div class="sm:col-span-2"><span class="font-medium text-base-content/70">Primary diagnosis:</span> {data.referralInfo.primaryDiagnosis || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Falls last year:</span> {data.fallHistory.fallsLastYear ?? 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Fear of falling:</span> {data.fallHistory.fearOfFalling || 'N/A'}</div>
			</div>
		</div>

		<!-- Medications -->
		{#if data.currentMedications.medications.length > 0}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Current medications</h2>
				<ul class="list-disc space-y-1 pl-5 text-sm text-base-content/80">
					{#each data.currentMedications.medications as med (med.name)}
						<li>{med.name} {med.dose} {med.frequency}</li>
					{/each}
				</ul>
			</div>
		{/if}

		<!-- Assistive devices -->
		{#if data.assistiveDevices.currentDevices.length > 0}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Assistive devices</h2>
				<p class="text-sm text-base-content/80">
					<span class="font-medium text-base-content/70">Current:</span>
					{data.assistiveDevices.currentDevices.join(', ')}
				</p>
				{#if data.assistiveDevices.recommendedDevices}
					<p class="mt-2 text-sm text-base-content/80">
						<span class="font-medium text-base-content/70">Recommended:</span>
						{data.assistiveDevices.recommendedDevices}
					</p>
				{/if}
			</div>
		{/if}

		<!-- Functional independence -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Functional independence</h2>
			<div class="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
				<div><span class="font-medium text-base-content/70">Transfers:</span> {data.functionalIndependence.transfers || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Ambulation:</span> {data.functionalIndependence.ambulation || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Stairs:</span> {data.functionalIndependence.stairs || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Bathing:</span> {data.functionalIndependence.bathing || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Dressing:</span> {data.functionalIndependence.dressing || 'N/A'}</div>
			</div>
		</div>
	</main>
{/if}
