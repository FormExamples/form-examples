<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { store } from '#lib/stores/adr.svelte.js';
	import { buildMarkdown } from '#lib/report/build-markdown.js';
	import {
		statusLabel,
		statusColor,
		groupLabel,
		completenessColor,
		priorityColor,
		pad4
	} from '#lib/engine/utils.js';
	import Button from '#lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(store.data);
	const result = $derived(store.result);

	$effect(() => {
		if (!store.result) {
			goto(`/architecture-decision-record/architecture-decision-records/${id}`);
		}
	});

	const md = $derived(buildMarkdown(store.data));
	const filename = $derived(
		`${data.adr.number ? pad4(data.adr.number) : 'NNNN'}-${data.adr.slug || 'adr'}.md`
	);

	let pdfError = $state('');

	function copyToClipboard() {
		if (navigator.clipboard) navigator.clipboard.writeText(md);
	}

	function downloadMarkdown() {
		const blob = new Blob([md], { type: 'text/markdown' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = filename;
		a.click();
		URL.revokeObjectURL(url);
	}

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/architecture-decision-records/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: store.data, result: store.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `architecture-decision-record-${data.adr.slug || id}.pdf`;
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
			<h1 class="text-lg font-bold text-base-content">Architecture decision record report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/architecture-decision-record/architecture-decision-records/${id}`)}>Edit</Button>
			</div>
		</div>
	</header>

	<main class="mx-16 px-4 py-6">
		<!-- Title -->
		<h2 class="mb-4 text-2xl font-bold text-base-content">
			{pad4(data.adr.number)}{data.adr.title ? ` — ${data.adr.title}` : ''}
		</h2>

		<!-- Completeness banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {completenessColor(result.completeness)}">
			<div class="text-3xl font-bold">{result.completeness}% complete</div>
			<div class="mt-2 flex flex-wrap justify-center gap-3 text-sm">
				<span class="rounded-full border px-3 py-0.5 {statusColor(result.status)}">{statusLabel(result.status)}</span>
				<span>{groupLabel(data.adr.decisionGroup)}</span>
				<span>{result.filledSections}/{result.totalSections} sections</span>
				{#if result.chosenPosition}<span>Chosen: {result.chosenPosition}</span>{/if}
			</div>
			<div class="mt-2 text-sm opacity-75">
				Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- Flags -->
		{#if result.flags.length > 0}
			<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-error">Flags to resolve</h2>
				<div class="space-y-2">
					{#each result.flags as flag (flag.id)}
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

		<!-- Metadata -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Metadata</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div><span class="font-medium text-base-content/70">Author:</span> {data.author.name || '—'}</div>
				<div><span class="font-medium text-base-content/70">Organization:</span> {data.organization.name || '—'}</div>
				<div><span class="font-medium text-base-content/70">Date:</span> {data.adr.decisionDate || '—'}</div>
				<div><span class="font-medium text-base-content/70">Positions:</span> {result.positionCount}</div>
			</div>
		</div>

		<!-- Markdown ADR -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<div class="mb-4 flex flex-wrap items-center justify-between gap-3">
				<h2 class="text-lg font-bold text-base-content">Markdown ADR</h2>
				<div class="flex gap-2 no-print">
					<Button data-variant="secondary" onclick={copyToClipboard}>Copy</Button>
					<Button data-variant="secondary" onclick={downloadMarkdown}>Download .md</Button>
				</div>
			</div>
			<p class="mb-4 text-sm text-base-content/70">
				Copy the Markdown into your repo at <code>docs/adr/{filename}</code>.
			</p>
			<pre class="overflow-x-auto whitespace-pre rounded bg-base-200 p-4 text-xs text-base-content">{md}</pre>
		</div>
	</main>
{/if}
