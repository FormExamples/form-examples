<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import {
		fluidStatusLabel,
		fluidStatusColor,
		priorityLabel,
		priorityColor,
		clinicianRoleLabel,
		categoryLabel,
		formatSignedMl
	} from '$lib/engine/utils';
	import Button from '$lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/fluid-balance-chart/fluid-balance-charts/${id}`);
		}
	});

	let pdfError = $state('');

	const intakeCategories = $derived(result ? Object.entries(result.intakeByCategory) : []);
	const outputCategories = $derived(result ? Object.entries(result.outputByCategory) : []);
	const rateText = $derived(
		!result || result.urineOutputRateMlPerKgPerHour === null
			? 'Not computable (weight or hours missing)'
			: `${result.urineOutputRateMlPerKgPerHour.toFixed(2)} mL/kg/h`
	);

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/fluid-balance-charts/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `fluid-balance-chart-${data.context.patientIdentifier || id}.pdf`;
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
			<h1 class="text-lg font-bold text-base-content">Fluid balance chart report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/fluid-balance-chart/fluid-balance-charts/${id}`)}>Edit</Button>
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-4xl px-4 py-6">
		<!-- Fluid-status banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {fluidStatusColor(result.fluidStatus)}">
			<div class="text-3xl font-bold">{fluidStatusLabel(result.fluidStatus)}</div>
			<div class="mt-2 text-sm font-semibold">
				Net balance {formatSignedMl(result.netBalanceMl)} over {result.hoursObserved} h
			</div>
			<div class="mt-2 text-sm opacity-75">
				Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- Balance -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Balance</h2>
			<table class="w-full text-sm">
				<tbody>
					<tr class="border-b border-base-200">
						<th class="py-2 pr-4 text-left font-medium text-base-content/70">Total intake</th>
						<td class="py-2">{result.totalIntakeMl} mL</td>
					</tr>
					<tr class="border-b border-base-200">
						<th class="py-2 pr-4 text-left font-medium text-base-content/70">Total output</th>
						<td class="py-2">{result.totalOutputMl} mL</td>
					</tr>
					<tr class="border-b border-base-200">
						<th class="py-2 pr-4 text-left font-medium text-base-content/70">Net balance</th>
						<td class="py-2">{formatSignedMl(result.netBalanceMl)}</td>
					</tr>
					<tr class="border-b border-base-200">
						<th class="py-2 pr-4 text-left font-medium text-base-content/70">Charting period observed</th>
						<td class="py-2">{result.hoursObserved} h</td>
					</tr>
					<tr class="border-b border-base-200">
						<th class="py-2 pr-4 text-left font-medium text-base-content/70">Weight</th>
						<td class="py-2">{result.weightKg === null ? '—' : `${result.weightKg} kg`}</td>
					</tr>
					<tr class="border-b border-base-200">
						<th class="py-2 pr-4 text-left font-medium text-base-content/70">Urine output</th>
						<td class="py-2">{result.urineOutputMl} mL</td>
					</tr>
					<tr class="border-b border-base-200">
						<th class="py-2 pr-4 text-left font-medium text-base-content/70">Urine output rate</th>
						<td class="py-2">{rateText}</td>
					</tr>
				</tbody>
			</table>
		</div>

		<!-- Intake by category -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Intake by category</h2>
			{#if intakeCategories.length === 0}
				<p class="text-sm text-base-content/70">None recorded.</p>
			{:else}
				<table class="w-full text-sm">
					<tbody>
						{#each intakeCategories as [cat, ml] (cat)}
							<tr class="border-b border-base-200">
								<th class="py-2 pr-4 text-left font-medium text-base-content/70">{categoryLabel(cat as never)}</th>
								<td class="py-2">{ml} mL</td>
							</tr>
						{/each}
					</tbody>
				</table>
			{/if}
		</div>

		<!-- Output by category -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Output by category</h2>
			{#if outputCategories.length === 0}
				<p class="text-sm text-base-content/70">None recorded.</p>
			{:else}
				<table class="w-full text-sm">
					<tbody>
						{#each outputCategories as [cat, ml] (cat)}
							<tr class="border-b border-base-200">
								<th class="py-2 pr-4 text-left font-medium text-base-content/70">{categoryLabel(cat as never)}</th>
								<td class="py-2">{ml} mL</td>
							</tr>
						{/each}
					</tbody>
				</table>
			{/if}
		</div>

		<!-- Intake entries -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Intake entries ({data.intake.length})</h2>
			{#if data.intake.length === 0}
				<p class="text-sm text-base-content/70">No intake entries recorded.</p>
			{:else}
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b border-base-300 text-left text-base-content/70">
							<th class="pb-2 pr-4">Time</th>
							<th class="pb-2 pr-4">Category</th>
							<th class="pb-2 pr-4">Route / description</th>
							<th class="pb-2">Volume</th>
						</tr>
					</thead>
					<tbody>
						{#each data.intake as e, i (i)}
							<tr class="border-b border-base-200">
								<td class="py-2 pr-4">{e.entryAt || `Row ${i + 1}`}</td>
								<td class="py-2 pr-4">{categoryLabel(e.category) || '—'}</td>
								<td class="py-2 pr-4">{e.description || '—'}</td>
								<td class="py-2">{e.volumeMl === null ? '—' : `${e.volumeMl} mL`}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			{/if}
		</div>

		<!-- Output entries -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Output entries ({data.output.length})</h2>
			{#if data.output.length === 0}
				<p class="text-sm text-base-content/70">No output entries recorded.</p>
			{:else}
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b border-base-300 text-left text-base-content/70">
							<th class="pb-2 pr-4">Time</th>
							<th class="pb-2 pr-4">Category</th>
							<th class="pb-2 pr-4">Description</th>
							<th class="pb-2">Volume</th>
						</tr>
					</thead>
					<tbody>
						{#each data.output as e, i (i)}
							<tr class="border-b border-base-200">
								<td class="py-2 pr-4">{e.entryAt || `Row ${i + 1}`}</td>
								<td class="py-2 pr-4">{categoryLabel(e.category) || '—'}</td>
								<td class="py-2 pr-4">{e.description || '—'}</td>
								<td class="py-2">{e.volumeMl === null ? '—' : `${e.volumeMl} mL`}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			{/if}
		</div>

		<!-- Flagged issues -->
		{#if result.flaggedIssues.length > 0}
			<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-error">Safety flags ({result.flaggedIssues.length})</h2>
				<div class="space-y-2">
					{#each result.flaggedIssues as flag (flag.id)}
						<div class="flex items-start gap-3 rounded-lg border p-3 {priorityColor(flag.priority)}">
							<span class="mt-0.5 rounded px-2 py-0.5 text-xs font-bold uppercase {priorityColor(flag.priority)}">
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

		<!-- Chart context -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Chart context</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div>
					<span class="font-medium text-base-content/70">Patient ID:</span>
					{data.context.patientIdentifier || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Ward / unit:</span>
					{data.context.wardOrUnit || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Charting clinician:</span>
					{data.context.clinicianName || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Role:</span>
					{clinicianRoleLabel(data.context.clinicianRole) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Chart start:</span>
					{data.context.chartStartAt || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Charting period:</span>
					{data.context.chartPeriodHours === null ? 'N/A' : `${data.context.chartPeriodHours} h`}
				</div>
			</div>
			{#if data.note.clinicalNote.trim() !== ''}
				<div class="mt-4 text-sm">
					<span class="font-medium text-base-content/70">Clinical note:</span>
					<p class="mt-1 text-base-content/80">{data.note.clinicalNote}</p>
				</div>
			{/if}
		</div>
	</main>
{/if}
