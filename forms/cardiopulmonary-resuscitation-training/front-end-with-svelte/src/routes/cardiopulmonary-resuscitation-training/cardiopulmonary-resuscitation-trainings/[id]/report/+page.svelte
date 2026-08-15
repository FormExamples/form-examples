<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import {
		outcomeLabel,
		outcomeColor,
		triStateLabel,
		priorityColor,
		roleLabel
	} from '#lib/engine/utils.js';
	import Badge from '#lib/components/ui/Badge.svelte';
	import Button from '#lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/cardiopulmonary-resuscitation-training/cardiopulmonary-resuscitation-trainings/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/cardiopulmonary-resuscitation-trainings/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `bls-skills-verification-${data.traineeDetails.lastName || id}.pdf`;
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
			<h1 class="text-lg font-bold text-base-content">BLS skills verification report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/cardiopulmonary-resuscitation-training/cardiopulmonary-resuscitation-trainings/${id}`)}>Edit</Button>
			</div>
		</div>
	</header>

	<main class="mx-16 px-4 py-6">
		<!-- Outcome banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {outcomeColor(result.outcome)}">
			<div class="text-3xl font-bold">{outcomeLabel(result.outcome)}</div>
			<div class="mt-2 flex justify-center gap-6 text-sm">
				<span>{result.criticalFailures.length} critical-action failure{result.criticalFailures.length === 1 ? '' : 's'}</span>
				<span>{result.nonCriticalDeficiencies.length} non-critical deficienc{result.nonCriticalDeficiencies.length === 1 ? 'y' : 'ies'}</span>
				<span>{result.answeredCount} / {result.totalRules} items assessed</span>
			</div>
			<div class="mt-2 text-sm opacity-75">
				Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- Critical-action failures -->
		{#if result.criticalFailures.length > 0}
			<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-error">Critical-action failures</h2>
				<ul class="list-disc space-y-1 pl-5 text-sm text-base-content/80">
					{#each result.criticalFailures as rule (rule.id)}
						<li><span class="font-medium">{rule.category}:</span> {rule.description}</li>
					{/each}
				</ul>
			</div>
		{/if}

		<!-- Flagged issues -->
		{#if result.additionalFlags.length > 0}
			<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-error">Flagged issues for examiner</h2>
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

		<!-- Checklist results -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Skills checklist</h2>
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-base-300 text-left text-base-content/70">
						<th class="pb-2 pr-4">Rule</th>
						<th class="pb-2 pr-4">Step</th>
						<th class="pb-2 pr-4">Category</th>
						<th class="pb-2 pr-4">Skill</th>
						<th class="pb-2">Status</th>
					</tr>
				</thead>
				<tbody>
					{#each result.firedRules as rule (rule.id)}
						<tr class="border-b border-base-200">
							<td class="py-2 pr-4 font-mono text-xs text-base-content/60">{rule.id}{#if rule.critical} *{/if}</td>
							<td class="py-2 pr-4">{rule.step}</td>
							<td class="py-2 pr-4">{rule.category}</td>
							<td class="py-2 pr-4">{rule.description}</td>
							<td class="py-2"><Badge status={rule.status} /></td>
						</tr>
					{/each}
				</tbody>
			</table>
			<p class="mt-3 text-xs text-base-content/60">* critical action — any failure forces an overall Fail.</p>
		</div>

		<!-- Trainee summary -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Trainee summary</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div><span class="font-medium text-base-content/70">Name:</span> {data.traineeDetails.firstName} {data.traineeDetails.lastName}</div>
				<div><span class="font-medium text-base-content/70">Trainee ID:</span> {data.traineeDetails.traineeId || '—'}</div>
				<div><span class="font-medium text-base-content/70">Role:</span> {roleLabel(data.traineeDetails.role) || '—'}</div>
				<div><span class="font-medium text-base-content/70">Session date:</span> {data.traineeDetails.sessionDate || '—'}</div>
				<div><span class="font-medium text-base-content/70">Examiner:</span> {data.traineeDetails.examinerName || '—'}</div>
				<div><span class="font-medium text-base-content/70">Prior cert. expiry:</span> {data.traineeDetails.priorCertificationExpiry || '—'}</div>
			</div>
		</div>

		<!-- Measurements -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Measurements & notes</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div><span class="font-medium text-base-content/70">Compression rate:</span> {data.chestCompressions.compressionRate ?? '—'} /min</div>
				<div><span class="font-medium text-base-content/70">Compression depth:</span> {data.chestCompressions.compressionDepth ?? '—'} cm</div>
				<div><span class="font-medium text-base-content/70">Time to first shock:</span> {data.aedShockDelivery.timeToFirstShockSeconds ?? '—'} s</div>
			</div>
			{#if data.teamDynamicsHandoff.examinerNotes}
				<p class="mt-4 text-sm"><span class="font-medium text-base-content/70">Examiner notes:</span> {data.teamDynamicsHandoff.examinerNotes}</p>
			{/if}
			{#if data.teamDynamicsHandoff.traineeFeedback}
				<p class="mt-2 text-sm"><span class="font-medium text-base-content/70">Trainee feedback:</span> {data.teamDynamicsHandoff.traineeFeedback}</p>
			{/if}
		</div>
	</main>
{/if}
