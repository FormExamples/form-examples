<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import {
		outcomeLabel,
		outcomeDescription,
		outcomeColor,
		priorityColor,
		reasonLabel,
		formatDate
	} from '$lib/engine/utils';
	import Button from '$lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/employee-offboarding-checklist/employee-offboarding-checklists/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/employee-offboarding-checklists/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `employee-offboarding-checklist-${data.employeeDetails.lastName || id}.pdf`;
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
			<h1 class="text-lg font-bold text-base-content">Offboarding checklist report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/employee-offboarding-checklist/employee-offboarding-checklists/${id}`)}>Edit</Button>
			</div>
		</div>
	</header>

	<main class="mx-16 px-4 py-6">
		<!-- Outcome banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {outcomeColor(result.outcome)}">
			<div class="text-3xl font-bold">{outcomeLabel(result.outcome)}</div>
			<div class="mt-2 text-sm">{outcomeDescription(result.outcome)}</div>
			<div class="mt-2 text-sm opacity-75">
				Mandatory items satisfied: {result.mandatorySatisfied} / {result.mandatoryTotal} ({result.completionPercent}%)
			</div>
			<div class="mt-1 text-sm opacity-75">
				Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- Blocking items -->
		{#if result.blockers.length > 0}
			<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-error">Blocking items (exit must not proceed)</h2>
				<ul class="list-disc space-y-1 pl-5 text-sm text-base-content/80">
					{#each result.blockers as b (b.id)}
						<li><span class="font-mono text-xs text-base-content/60">{b.id}</span> — <span class="font-medium">{b.category}:</span> {b.description}</li>
					{/each}
				</ul>
			</div>
		{/if}

		<!-- Flagged issues -->
		{#if result.additionalFlags.length > 0}
			<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-error">Flagged issues for HR / line manager</h2>
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

		<!-- Outstanding items -->
		{#if result.firedRules.length > 0}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Outstanding checklist items</h2>
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b border-base-300 text-left text-base-content/70">
							<th class="pb-2 pr-4">Item</th>
							<th class="pb-2 pr-4">Category</th>
							<th class="pb-2 pr-4">Description</th>
							<th class="pb-2 pr-4">Mandatory</th>
							<th class="pb-2">Blocker</th>
						</tr>
					</thead>
					<tbody>
						{#each result.firedRules as rule (rule.id)}
							<tr class="border-b border-base-200">
								<td class="py-2 pr-4 font-mono text-xs text-base-content/60">{rule.id}</td>
								<td class="py-2 pr-4">{rule.category}</td>
								<td class="py-2 pr-4">{rule.description}</td>
								<td class="py-2 pr-4">{rule.mandatory ? 'Yes' : 'No'}</td>
								<td class="py-2">{rule.blocker ? 'Yes' : 'No'}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}

		<!-- Employee summary -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Employee summary</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div><span class="font-medium text-base-content/70">Name:</span> {data.employeeDetails.firstName} {data.employeeDetails.lastName}</div>
				<div><span class="font-medium text-base-content/70">Employee ID:</span> {data.employeeDetails.employeeId || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Job title:</span> {data.employeeDetails.jobTitle || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Department:</span> {data.employeeDetails.department || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Line manager:</span> {data.employeeDetails.lineManager || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Last working day:</span> {formatDate(data.employeeDetails.lastWorkingDay)}</div>
				<div><span class="font-medium text-base-content/70">Reason for leaving:</span> {reasonLabel(data.employeeDetails.reasonForLeaving)}</div>
			</div>
		</div>
	</main>
{/if}
