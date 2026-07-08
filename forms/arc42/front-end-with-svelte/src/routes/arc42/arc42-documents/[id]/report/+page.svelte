<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { store } from '$lib/stores/documentation.svelte';
	import {
		maturityLabel,
		maturityColor,
		completenessLabel,
		completenessColor,
		recommendationLabel
	} from '$lib/grading/utils';
	import Button from '$lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(store.data);
	const result = $derived(store.result);

	$effect(() => {
		if (!store.result) {
			goto(`/arc42/arc42-documents/${id}`);
		}
	});

	const SECTION_NAMES: Record<number, string> = {
		1: 'Introduction & Goals',
		2: 'Constraints',
		3: 'Context & Scope',
		4: 'Solution Strategy',
		5: 'Building Block View',
		6: 'Runtime View',
		7: 'Deployment View',
		8: 'Crosscutting Concepts',
		9: 'Architectural Decisions',
		10: 'Quality Requirements',
		11: 'Risks & Technical Debt',
		12: 'Glossary'
	};

	const priorityColor: Record<string, string> = {
		high: 'bg-error text-error-content border-error',
		medium: 'bg-warning text-warning-content border-warning',
		low: 'bg-base-300 text-base-content border-base-300'
	};

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/arc42-documents/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: store.data, result: store.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `arc42-${data.architecture.name || id}.pdf`;
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
			<h1 class="text-lg font-bold text-base-content">arc42 architecture report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/arc42/arc42-documents/${id}`)}>Edit</Button>
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-4xl px-4 py-6">
		<!-- Maturity banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {maturityColor(result.finalMaturity)}">
			<div class="text-3xl font-bold">{maturityLabel(result.finalMaturity)}</div>
			{#if result.finalMaturity !== result.computedMaturity}
				<div class="mt-2 text-sm">Computed: {maturityLabel(result.computedMaturity)} (overridden)</div>
			{/if}
			{#if data.recommendation}
				<div class="mt-2 text-sm">Recommendation: {recommendationLabel(data.recommendation)}</div>
			{/if}
		</div>

		<!-- Title block -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">{data.architecture.name || 'Untitled architecture'}</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-3">
				<div><span class="font-medium text-base-content/70">Version:</span> {data.architecture.version || '—'}</div>
				<div><span class="font-medium text-base-content/70">Owner:</span> {data.architecture.owner || '—'}</div>
				<div><span class="font-medium text-base-content/70">Status:</span> {data.architecture.status || '—'}</div>
				<div><span class="font-medium text-base-content/70">Author:</span> {data.authorName || '—'}</div>
				<div><span class="font-medium text-base-content/70">Role:</span> {data.authorRole || '—'}</div>
				<div><span class="font-medium text-base-content/70">Date:</span> {data.documentDate || '—'}</div>
			</div>
			{#if data.architecture.description}
				<p class="mt-4 text-sm text-base-content/80">{data.architecture.description}</p>
			{/if}
		</div>

		<!-- Completeness by section -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Completeness by section</h2>
			<ul class="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
				{#each Object.entries(SECTION_NAMES) as [n, name] (n)}
					<li class="flex items-center gap-2">
						<span class="text-base-content/60">§{n}</span>
						<span class="flex-1 text-base-content/80">{name}</span>
						<span class="font-semibold {completenessColor(result.completenessBySection[Number(n)] ?? 'empty')}">
							{completenessLabel(result.completenessBySection[Number(n)] ?? 'empty')}
						</span>
					</li>
				{/each}
			</ul>
		</div>

		<!-- Flagged issues -->
		{#if result.additionalFlags.length > 0}
			<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-error">Flagged issues for review</h2>
				<div class="space-y-2">
					{#each result.additionalFlags as flag (flag.category)}
						<div class="flex items-start gap-3 rounded-lg border p-3 {priorityColor[flag.priority]}">
							<span class="mt-0.5 rounded px-2 py-0.5 text-xs font-bold uppercase {priorityColor[flag.priority]}">
								{flag.priority}
							</span>
							<div><span class="font-medium">{flag.category}:</span> {flag.description}</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Fired rules -->
		{#if result.firedRules.length > 0}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Maturity assessment justification</h2>
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b border-base-300 text-left text-base-content/70">
							<th class="pb-2 pr-4">Rule</th>
							<th class="pb-2">Finding</th>
						</tr>
					</thead>
					<tbody>
						{#each result.firedRules as rule (rule.ruleId)}
							<tr class="border-b border-base-200">
								<td class="py-2 pr-4 font-mono text-xs text-base-content/60">{rule.ruleId}</td>
								<td class="py-2">{rule.description}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}

		<!-- Sign-off -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Sign-off</h2>
			{#if data.additionalNotes}
				<p class="mb-3 text-sm text-base-content/80">{data.additionalNotes}</p>
			{/if}
			{#if data.signedBy}
				<p class="text-sm text-base-content/80">Signed: {data.signedBy} &middot; {data.signedAt || '—'}</p>
			{:else}
				<p class="text-sm text-base-content/60">Signed: ____________________ &nbsp; Date: ____________</p>
			{/if}
		</div>
	</main>
{/if}
