<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { meeting } from '$lib/stores/meeting.svelte';
	import {
		healthLabel,
		healthColor,
		completionStatusLabel,
		gradeColor,
		priorityColor,
		statusLabel,
		categoryLabel,
		overallResultLabel,
		formatDateTime
	} from '$lib/engine/utils';
	import Button from '$lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(meeting.data);
	const result = $derived(meeting.result);

	$effect(() => {
		if (!meeting.result) {
			goto(`/meeting/meetings/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/meetings/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: meeting.data, result: meeting.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `meeting-${data.meta.title || id}.pdf`;
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
			<h1 class="text-lg font-bold text-base-content">Meeting record report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/meeting/meetings/${id}`)}>Edit</Button>
			</div>
		</div>
	</header>

	<main class="mx-16 px-4 py-6">
		<!-- Overall health banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {healthColor(result.overallHealth)}">
			<div class="text-3xl font-bold">{healthLabel(result.overallHealth)}</div>
			<div class="mt-2 flex flex-wrap justify-center gap-6 text-sm">
				<span>Completion: {completionStatusLabel(result.completionStatus)}</span>
				{#if data.meta.title}<span>{data.meta.title}</span>{/if}
			</div>
			<div class="mt-2 text-sm opacity-75">
				Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- Counts -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Meeting at a glance</h2>
			<div class="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
				<div><span class="block text-base-content/60">Duration</span><span class="font-semibold">{result.durationMinutes == null ? '—' : `${result.durationMinutes} min`}</span></div>
				<div><span class="block text-base-content/60">Participants</span><span class="font-semibold">{result.participantCount}</span></div>
				<div><span class="block text-base-content/60">Accepted</span><span class="font-semibold">{result.acceptedCount}</span></div>
				<div><span class="block text-base-content/60">Attended</span><span class="font-semibold">{result.attendedCount}</span></div>
				<div><span class="block text-base-content/60">Agenda items</span><span class="font-semibold">{result.agendaItemCount}</span></div>
				<div><span class="block text-base-content/60">Action items</span><span class="font-semibold">{result.actionItemCount} ({result.openActionCount} open)</span></div>
				<div><span class="block text-base-content/60">Outputs</span><span class="font-semibold">{result.outputCount}</span></div>
				<div><span class="block text-base-content/60">Outcomes</span><span class="font-semibold">{result.outcomeCount}</span></div>
			</div>
		</div>

		<!-- Flags -->
		{#if result.flags.length > 0}
			<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-error">Flags for the organiser</h2>
				<div class="space-y-2">
					{#each result.flags as flag (flag.flagId)}
						<div class="flex items-start gap-3 rounded-lg border p-3 {priorityColor(flag.priority)}">
							<span class="mt-0.5 rounded px-2 py-0.5 text-xs font-bold uppercase {priorityColor(flag.priority)}">
								{flag.priority}
							</span>
							<div>
								<span class="font-medium">{flag.category}:</span> {flag.description}
								<div class="mt-1 text-sm italic">{flag.suggestedAction}</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Fired rules -->
		{#if result.firedRules.length > 0}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Validation findings</h2>
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b border-base-300 text-left text-base-content/70">
							<th class="pb-2 pr-4">Rule</th>
							<th class="pb-2 pr-4">Instrument</th>
							<th class="pb-2 pr-4">Finding</th>
							<th class="pb-2">Grade</th>
						</tr>
					</thead>
					<tbody>
						{#each result.firedRules as rule (rule.ruleId)}
							<tr class="border-b border-base-200">
								<td class="py-2 pr-4 font-mono text-xs text-base-content/60">{rule.ruleId}</td>
								<td class="py-2 pr-4">{rule.instrument}</td>
								<td class="py-2 pr-4">{rule.description}</td>
								<td class="py-2">
									<span class="inline-block rounded-full border px-3 py-1 text-xs font-bold uppercase {gradeColor(rule.grade)}">{rule.grade}</span>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}

		<!-- Meeting summary -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Meeting details</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div><span class="font-medium text-base-content/70">Title:</span> {data.meta.title || '(untitled)'}</div>
				<div><span class="font-medium text-base-content/70">Category:</span> {categoryLabel(data.meta.category)}</div>
				<div><span class="font-medium text-base-content/70">Status:</span> {statusLabel(data.meta.status)}</div>
				<div><span class="font-medium text-base-content/70">Result:</span> {overallResultLabel(data.signoff.overallResult)}</div>
				<div><span class="font-medium text-base-content/70">Organiser:</span> {data.organizer.name || '—'}</div>
				<div><span class="font-medium text-base-content/70">Scheduled:</span> {formatDateTime(data.invitation.scheduledStartAt)}</div>
			</div>
			{#if data.summary.summary}
				<p class="mt-4 text-sm text-base-content/80">{data.summary.summary}</p>
			{/if}
		</div>

		<!-- Action items -->
		{#if data.results.actionItems.length > 0}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Action items</h2>
				<ul class="list-disc space-y-1 pl-5 text-sm text-base-content/80">
					{#each data.results.actionItems as a (a.title + a.ownerName)}
						<li>
							<strong>{a.title || '(untitled)'}</strong>
							{#if a.ownerName}— {a.ownerName}{/if}
							{#if a.dueDate}(due {a.dueDate}){/if}
							<span class="ml-1 text-base-content/60">[{a.status}]</span>
						</li>
					{/each}
				</ul>
			</div>
		{/if}
	</main>
{/if}
