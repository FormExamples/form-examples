<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { store } from '$lib/stores/checklist.svelte';
	import { statusLabel, statusColor, urgencyLabel, priorityColor } from '$lib/checklist/labels';
	import Button from '$lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(store.data);
	const result = $derived(store.result);

	$effect(() => {
		if (!store.result) {
			goto(`/who-surgical-safety-checklists/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/who-surgical-safety-checklists/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: store.data, result: store.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `who-surgical-safety-checklist-${data.plannedProcedure || id}.pdf`;
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
			<h1 class="text-lg font-bold text-base-content">Surgical safety checklist report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/who-surgical-safety-checklists/${id}`)}>Edit</Button>
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-4xl px-4 py-6">
		<!-- Lifecycle status banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {statusColor(result.status)}">
			<div class="text-3xl font-bold">{statusLabel(result.status)}</div>
			<div class="mt-2 text-sm">
				{data.plannedProcedure || '—'} · {urgencyLabel(data.urgency)}
			</div>
			<div class="mt-2 text-sm opacity-75">
				Generated {new Date(result.generatedAt).toLocaleString()}
			</div>
		</div>

		<!-- Safety flags -->
		{#if result.flags.length > 0}
			<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-error">Safety flags</h2>
				<div class="space-y-2">
					{#each result.flags as flag (flag.flag)}
						<div class="flex items-start gap-3 rounded-lg border p-3 {priorityColor(flag.priority)}">
							<span class="mt-0.5 rounded px-2 py-0.5 text-xs font-bold uppercase {priorityColor(flag.priority)}">
								{flag.priority}
							</span>
							<div>{flag.message}</div>
						</div>
					{/each}
				</div>
			</div>
		{:else}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<p class="text-base-content/70">No safety flags raised.</p>
			</div>
		{/if}

		<!-- Case summary -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Case summary</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div><span class="font-medium text-base-content/70">Site:</span> {data.siteName || '—'}</div>
				<div><span class="font-medium text-base-content/70">Operating room:</span> {data.operatingRoom || '—'}</div>
				<div><span class="font-medium text-base-content/70">Case date:</span> {data.caseDate || '—'}</div>
				<div><span class="font-medium text-base-content/70">Specialty:</span> {data.surgicalSpecialty || '—'}</div>
				<div><span class="font-medium text-base-content/70">Laterality:</span> {data.laterality || '—'}</div>
				<div><span class="font-medium text-base-content/70">Paediatric:</span> {data.isPaediatric || '—'}</div>
			</div>
		</div>

		<!-- Phase sign-offs -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Phase sign-offs</h2>
			<dl class="grid grid-cols-1 gap-2 text-sm sm:grid-cols-3">
				<div>
					<dt class="font-medium text-base-content/70">Sign In</dt>
					<dd>{data.signInCompletedAt ? `${data.signInCoordinatorName} — ${data.signInCompletedAt}` : 'pending'}</dd>
				</div>
				<div>
					<dt class="font-medium text-base-content/70">Time Out</dt>
					<dd>{data.timeOutCompletedAt ? `${data.timeOutCoordinatorName} — ${data.timeOutCompletedAt}` : 'pending'}</dd>
				</div>
				<div>
					<dt class="font-medium text-base-content/70">Sign Out</dt>
					<dd>{data.signOutCompletedAt ? `${data.signOutCoordinatorName} — ${data.signOutCompletedAt}` : 'pending'}</dd>
				</div>
			</dl>
		</div>

		<!-- Team roster -->
		{#if data.teamMembers.length > 0}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Operating team roster</h2>
				<ul class="list-disc space-y-1 pl-5 text-sm text-base-content/80">
					{#each data.teamMembers as m, i (i)}
						<li>
							<strong>{m.name || '—'}</strong>
							<span class="text-base-content/60">({m.role || '—'})</span>
							— introduced: {m.introducedDuringTimeOut || '—'}
						</li>
					{/each}
				</ul>
			</div>
		{/if}

		<!-- Abandoned -->
		{#if data.abandonedReason}
			<div class="mb-6 rounded-xl border-2 border-error bg-base-100 p-6">
				<h2 class="mb-2 text-lg font-bold text-error">Case abandoned</h2>
				<p class="text-sm text-base-content/80">{data.abandonedReason}</p>
			</div>
		{/if}
	</main>
{/if}
