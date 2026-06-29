<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { store } from '$lib/stores/fitnote.svelte';
	import {
		fitnessCategoryLabel,
		fitnessCategoryColor,
		periodComplianceLabel,
		adaptationIntensityLabel,
		recommendationLabel,
		recommendationColor,
		validColor,
		priorityColor,
		calculateAge
	} from '$lib/engine/utils';
	import Button from '$lib/components/ui/Button.svelte';

	const plural = 'united-kingdom-statements-of-fitness-for-work';
	const id = $derived(page.params.id ?? 'new');
	const data = $derived(store.data);
	const result = $derived(store.result);

	$effect(() => {
		if (!store.result) {
			goto(`/${plural}/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/${plural}/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: store.data, result: store.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `fit-note-${data.patient.name || id}.pdf`;
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
			<h1 class="text-lg font-bold text-base-content">Fit-note report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/${plural}/${id}`)}>Edit</Button>
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-4xl px-4 py-6">
		<!-- Fitness banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {fitnessCategoryColor(result.fitnessCategory)}">
			<div class="text-3xl font-bold">{fitnessCategoryLabel(result.fitnessCategory)}</div>
			<div class="mt-2 flex flex-wrap justify-center gap-6 text-sm">
				<span>Validity: {result.isValid === 'yes' ? 'Valid' : 'Invalid'}</span>
				{#if result.periodDays !== null}<span>{result.periodDays} days</span>{/if}
				<span>{periodComplianceLabel(result.periodCompliance)}</span>
			</div>
			<div class="mt-2 text-sm opacity-75">
				Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- Verdict cards -->
		<div class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
			<div class="rounded-xl border p-4 text-center {validColor(result.isValid)}">
				<div class="text-xs font-semibold uppercase">Validity</div>
				<div class="mt-1 text-lg font-bold">{result.isValid === 'yes' ? 'Valid' : 'Invalid'}</div>
			</div>
			<div class="rounded-xl border border-base-300 bg-base-100 p-4 text-center text-base-content">
				<div class="text-xs font-semibold uppercase text-base-content/70">Adaptations</div>
				<div class="mt-1 text-lg font-bold">
					{adaptationIntensityLabel(result.adaptationIntensity)} ({result.adaptationCount})
				</div>
			</div>
			<div class="rounded-xl border p-4 text-center {recommendationColor(result.recommendation)}">
				<div class="text-xs font-semibold uppercase">Recommendation</div>
				<div class="mt-1 text-sm font-bold">{recommendationLabel(result.recommendation)}</div>
			</div>
		</div>

		<!-- Safety flags -->
		{#if result.safetyFlags.length > 0}
			<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-error">
					Safety flags ({result.safetyFlags.length})
				</h2>
				<div class="space-y-2">
					{#each result.safetyFlags as flag (flag.flagId)}
						<div class="flex items-start gap-3 rounded-lg border p-3 {priorityColor(flag.priority)}">
							<span class="mt-0.5 rounded px-2 py-0.5 text-xs font-bold uppercase {priorityColor(flag.priority)}">
								{flag.priority}
							</span>
							<div>
								<div class="font-medium">{flag.description}</div>
								<div class="text-sm opacity-90">Suggested: {flag.suggestedAction}</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{:else}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6 text-sm text-base-content/70">
				No safety flags fired.
			</div>
		{/if}

		<!-- Patient & issuer summary -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Summary</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div><span class="font-medium text-base-content/70">Patient:</span> {data.patient.name}</div>
				<div>
					<span class="font-medium text-base-content/70">DOB:</span> {data.patient.birthDate}
					{#if calculateAge(data.patient.birthDate)}(Age {calculateAge(data.patient.birthDate)}){/if}
				</div>
				<div><span class="font-medium text-base-content/70">Issuer:</span> {data.clinician.name}</div>
				<div><span class="font-medium text-base-content/70">Profession:</span> {data.clinician.profession}</div>
				<div class="sm:col-span-2">
					<span class="font-medium text-base-content/70">Diagnosis:</span> {data.diagnosisText || '—'}
				</div>
				{#if data.comments}
					<div class="sm:col-span-2">
						<span class="font-medium text-base-content/70">Comments:</span> {data.comments}
					</div>
				{/if}
			</div>
		</div>

		<!-- Fired rules -->
		{#if result.firedRules.length > 0}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Policy justification</h2>
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b border-base-300 text-left text-base-content/70">
							<th class="pb-2 pr-4">Rule</th>
							<th class="pb-2 pr-4">Set</th>
							<th class="pb-2 pr-4">Severity</th>
							<th class="pb-2">Finding</th>
						</tr>
					</thead>
					<tbody>
						{#each result.firedRules as rule (rule.ruleId)}
							<tr class="border-b border-base-200">
								<td class="py-2 pr-4 font-mono text-xs text-base-content/60">{rule.ruleId}</td>
								<td class="py-2 pr-4">{rule.ruleSet}</td>
								<td class="py-2 pr-4">{rule.severity}</td>
								<td class="py-2">{rule.description}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</main>
{/if}
