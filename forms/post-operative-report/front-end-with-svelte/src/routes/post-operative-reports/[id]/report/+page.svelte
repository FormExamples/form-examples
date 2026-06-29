<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import {
		gradeLabel,
		gradeDescription,
		gradeBadgeColor,
		priorityColor,
		dispositionLabel,
		formatDuration,
		calculateAge
	} from '$lib/engine/utils';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/post-operative-reports/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/post-operative-reports/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `post-operative-report-${data.patientDetails.lastName || id}.pdf`;
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
			<h1 class="text-lg font-bold text-base-content">Post-operative report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/post-operative-reports/${id}`)}>Edit</Button>
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-4xl px-4 py-6">
		<!-- Overall grade banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {gradeBadgeColor(result.overallGrade)}">
			<div class="text-3xl font-bold">{gradeLabel(result.overallGrade)}</div>
			<div class="mt-2 text-sm">{gradeDescription(result.overallGrade)}</div>
			<div class="mt-2 text-sm opacity-75">
				{result.complicationCount} graded complication{result.complicationCount === 1 ? '' : 's'} ·
				Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- Flagged issues -->
		{#if result.additionalFlags.length > 0}
			<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-error">Flagged issues for the clinical team</h2>
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

		<!-- Per-complication grades -->
		{#if result.firedRules.length > 0}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Per-complication grades</h2>
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b border-base-300 text-left text-base-content/70">
							<th class="pb-2 pr-4">ID</th>
							<th class="pb-2 pr-4">Complication</th>
							<th class="pb-2 pr-4">Grade</th>
							<th class="pb-2">Description</th>
						</tr>
					</thead>
					<tbody>
						{#each result.firedRules as rule (rule.id)}
							<tr class="border-b border-base-200">
								<td class="py-2 pr-4 font-mono text-xs text-base-content/60">{rule.id}</td>
								<td class="py-2 pr-4">{rule.category}</td>
								<td class="py-2 pr-4"><Badge grade={rule.grade} /></td>
								<td class="py-2 text-base-content/70">{rule.description}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{:else}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<p class="text-sm text-base-content/70">No graded complications recorded.</p>
			</div>
		{/if}

		<!-- Patient & procedure summary -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Patient &amp; procedure summary</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div><span class="font-medium text-base-content/70">Name:</span> {data.patientDetails.firstName} {data.patientDetails.lastName}</div>
				<div>
					<span class="font-medium text-base-content/70">DOB:</span> {data.patientDetails.dateOfBirth}
					{#if calculateAge(data.patientDetails.dateOfBirth)}(Age {calculateAge(data.patientDetails.dateOfBirth)}){/if}
				</div>
				<div><span class="font-medium text-base-content/70">ASA:</span> {data.patientDetails.asaGrade || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Procedure:</span> {data.procedureDetails.procedureName || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Priority:</span> {data.procedureDetails.priority || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Duration:</span> {formatDuration(data.procedureDetails.durationMinutes)}</div>
				<div><span class="font-medium text-base-content/70">Surgeon:</span> {data.surgicalTeam.primarySurgeon || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Disposition:</span> {dispositionLabel(data.immediatePostopStatus.disposition)}</div>
			</div>
		</div>
	</main>
{/if}
