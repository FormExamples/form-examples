<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { riskLevelLabel, riskLevelColor, priorityColor, calculateAge } from '$lib/engine/utils';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/genetics-assessment/genetics-assessments/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/genetics-assessments/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `genetics-assessment-${data.probandDemographics.lastName || id}.pdf`;
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
			<h1 class="text-lg font-bold text-base-content">Genetics assessment report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/genetics-assessment/genetics-assessments/${id}`)}>Edit</Button>
			</div>
		</div>
	</header>

	<main class="mx-16 px-4 py-6">
		<!-- Overall risk banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {riskLevelColor(result.riskLevel)}">
			<div class="text-3xl font-bold">{riskLevelLabel(result.riskLevel)}</div>
			<div class="mt-2 text-sm opacity-75">
				Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- Computed scores -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Computed scores</h2>
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-base-300 text-left text-base-content/70">
						<th class="pb-2 pr-4">Instrument</th>
						<th class="pb-2 pr-4">Result</th>
						<th class="pb-2">Threshold</th>
					</tr>
				</thead>
				<tbody>
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4">Manchester Score</td>
						<td class="py-2 pr-4 font-bold">{result.manchesterScore}</td>
						<td class="py-2 text-base-content/70">&ge;15 consider; &ge;20 moderate; &ge;30 high</td>
					</tr>
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4">Bethesda criteria met</td>
						<td class="py-2 pr-4 font-bold">{result.bethesdaMet} / 5</td>
						<td class="py-2 text-base-content/70">&ge;1 indicates MMR IHC / MSI testing</td>
					</tr>
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4">PREMM5 (external)</td>
						<td class="py-2 pr-4 font-bold">{result.premm5Score === null ? '—' : `${result.premm5Score}%`}</td>
						<td class="py-2 text-base-content/70">&ge;5% indicates Lynch testing</td>
					</tr>
					<tr>
						<td class="py-2 pr-4">Tyrer-Cuzick lifetime (external)</td>
						<td class="py-2 pr-4 font-bold">{result.tyrerCuzickLifetime ? `${result.tyrerCuzickLifetime}%` : '—'}</td>
						<td class="py-2 text-base-content/70">&ge;17% moderate; &ge;30% high (NICE FH)</td>
					</tr>
				</tbody>
			</table>
		</div>

		<!-- Flagged issues -->
		{#if result.additionalFlags.length > 0}
			<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-error">Flagged issues for clinical geneticist</h2>
				<div class="space-y-2">
					{#each result.additionalFlags as flag (flag.id)}
						<div class="flex items-start gap-3 rounded-lg border p-3 {priorityColor(flag.priority)}">
							<span class="mt-0.5 rounded px-2 py-0.5 text-xs font-bold uppercase {priorityColor(flag.priority)}">
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
				<h2 class="mb-4 text-lg font-bold text-base-content">Risk assessment justification</h2>
				<p class="mb-3 text-sm text-base-content/60">
					Overall risk is the maximum severity of any rule that fired below.
				</p>
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b border-base-300 text-left text-base-content/70">
							<th class="pb-2 pr-4">Rule</th>
							<th class="pb-2 pr-4">Category</th>
							<th class="pb-2 pr-4">Finding</th>
							<th class="pb-2">Severity</th>
						</tr>
					</thead>
					<tbody>
						{#each result.firedRules as rule (rule.id)}
							<tr class="border-b border-base-200">
								<td class="py-2 pr-4 font-mono text-xs text-base-content/60">{rule.id}</td>
								<td class="py-2 pr-4">{rule.category}</td>
								<td class="py-2 pr-4">{rule.description}</td>
								<td class="py-2"><Badge severity={rule.severity} /></td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}

		<!-- Proband summary -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Proband summary</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div><span class="font-medium text-base-content/70">Name:</span> {data.probandDemographics.firstName} {data.probandDemographics.lastName}</div>
				<div>
					<span class="font-medium text-base-content/70">DOB:</span> {data.probandDemographics.dateOfBirth}
					{#if calculateAge(data.probandDemographics.dateOfBirth)}(Age {calculateAge(data.probandDemographics.dateOfBirth)}){/if}
				</div>
				<div><span class="font-medium text-base-content/70">Sex:</span> {data.probandDemographics.sex || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">MRN:</span> {data.probandDemographics.mrn || 'N/A'}</div>
			</div>
			{#if data.presentingConcern.suspectedSyndrome}
				<p class="mt-4 text-sm">
					<span class="font-medium text-base-content/70">Suspected syndrome:</span>
					{data.presentingConcern.suspectedSyndrome}
				</p>
			{/if}
		</div>
	</main>
{/if}
