<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import {
		fitnessStatementLabel,
		fitnessStatementColor,
		restrictionPriorityLabel,
		restrictionPriorityColor,
		clinicianRoleLabel,
		mechanismLabel,
		calculateAge
	} from '$lib/engine/utils';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/return-to-work/return-to-work-records/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/return-to-work-records/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `return-to-work-${data.patient.lastName || id}.pdf`;
				a.click();
				URL.revokeObjectURL(url);
			} else {
				pdfError = 'Failed to generate PDF. Please try again.';
			}
		} catch {
			pdfError = 'Failed to generate PDF. Please check your connection and try again.';
		}
	}

	const priorityColor: Record<string, string> = {
		high: 'bg-error text-error-content border-error',
		medium: 'bg-warning text-warning-content border-warning',
		low: 'bg-base-300 text-base-content border-base-300'
	};
</script>

{#if result}
	<header class="border-b border-base-300 bg-base-100 shadow-sm no-print">
		<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
			<h1 class="text-lg font-bold text-base-content">Statement of Fitness for Work</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/return-to-work/return-to-work-records/${id}`)}>Edit</Button>
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-4xl px-4 py-6">
		<!-- Fitness banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {fitnessStatementColor(result.fitnessStatement)}">
			<div class="text-3xl font-bold">{fitnessStatementLabel(result.fitnessStatement)}</div>
			<div class="mt-2 flex flex-wrap justify-center gap-3 text-sm">
				<span class="rounded-full border px-3 py-1 {restrictionPriorityColor(result.restrictionPriority)}">
					Restriction priority: {restrictionPriorityLabel(result.restrictionPriority)}
				</span>
			</div>
			{#if result.overridden}
				<div class="mt-2 text-sm opacity-90">
					Clinician override applied (computed: {fitnessStatementLabel(result.computedFitness)})
				</div>
			{/if}
			<div class="mt-2 text-sm opacity-75">
				Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- Validity period -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Period of validity</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div><span class="font-medium text-base-content/70">Valid from:</span> {data.fitness.validFrom || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Valid to:</span> {data.fitness.validTo || (data.fitness.validWeeks !== null ? `${data.fitness.validWeeks} weeks` : 'N/A')}</div>
				<div><span class="font-medium text-base-content/70">Reassessment required:</span> {data.fitness.reassessmentRequired || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Clinician confidence:</span> {data.fitness.clinicianConfidence || 'N/A'}</div>
			</div>
		</div>

		<!-- Flagged issues -->
		{#if result.additionalFlags.length > 0}
			<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-error">Flagged issues for occupational health</h2>
				<div class="space-y-2">
					{#each result.additionalFlags as flag (flag.id)}
						<div class="flex items-start gap-3 rounded-lg border p-3 {priorityColor[flag.priority]}">
							<span class="mt-0.5 rounded px-2 py-0.5 text-xs font-bold uppercase {priorityColor[flag.priority]}">
								{flag.priority}
							</span>
							<div><span class="font-medium">{flag.category}:</span> {flag.message}</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Fired restriction rules -->
		{#if result.firedRules.length > 0}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Restriction justification</h2>
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b border-base-300 text-left text-base-content/70">
							<th class="pb-2 pr-4">Rule</th>
							<th class="pb-2 pr-4">Area</th>
							<th class="pb-2 pr-4">Adjustment</th>
							<th class="pb-2">Grade</th>
						</tr>
					</thead>
					<tbody>
						{#each result.firedRules as rule (rule.id)}
							<tr class="border-b border-base-200">
								<td class="py-2 pr-4 font-mono text-xs text-base-content/60">{rule.id}</td>
								<td class="py-2 pr-4">{rule.system}</td>
								<td class="py-2 pr-4">{rule.description}</td>
								<td class="py-2"><Badge grade={rule.grade} /></td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}

		<!-- Patient & clinician summary -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Summary</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div><span class="font-medium text-base-content/70">Patient:</span> {data.patient.firstName} {data.patient.lastName}</div>
				<div>
					<span class="font-medium text-base-content/70">DOB:</span> {data.patient.dateOfBirth || 'N/A'}
					{#if calculateAge(data.patient.dateOfBirth)}(Age {calculateAge(data.patient.dateOfBirth)}){/if}
				</div>
				<div><span class="font-medium text-base-content/70">Employer:</span> {data.patient.employerName || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Job title:</span> {data.job.jobTitle || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Reason:</span> {data.diagnosis.primaryDiagnosis || 'N/A'} ({mechanismLabel(data.diagnosis.mechanism)})</div>
				<div><span class="font-medium text-base-content/70">Days absent:</span> {data.absence.totalDaysAbsent ?? 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Clinician:</span> {data.clinician.name || 'N/A'} ({clinicianRoleLabel(data.clinician.role)})</div>
				<div><span class="font-medium text-base-content/70">Registration:</span> {data.clinician.registrationNumber || 'N/A'}</div>
			</div>
		</div>

		<!-- Phased return -->
		{#if data.phasedReturn.applicable === 'yes'}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Phased return plan</h2>
				<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
					<div><span class="font-medium text-base-content/70">Starting hours/week:</span> {data.phasedReturn.startHoursPerWeek ?? 'N/A'}</div>
					<div><span class="font-medium text-base-content/70">Days per week:</span> {data.phasedReturn.daysPerWeek ?? 'N/A'}</div>
					<div><span class="font-medium text-base-content/70">Target full-hours date:</span> {data.phasedReturn.targetFullHoursDate || 'N/A'}</div>
					<div><span class="font-medium text-base-content/70">Support contact:</span> {data.phasedReturn.supportContact || 'N/A'}</div>
				</div>
			</div>
		{/if}

		<!-- Override / notes -->
		{#if data.signOff.overrideReason || data.signOff.finalNotes}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Clinician notes</h2>
				{#if data.signOff.overrideReason}
					<p class="text-sm text-base-content/80"><span class="font-medium">Override reason:</span> {data.signOff.overrideReason}</p>
				{/if}
				{#if data.signOff.finalNotes}
					<p class="mt-2 text-sm text-base-content/80">{data.signOff.finalNotes}</p>
				{/if}
			</div>
		{/if}
	</main>
{/if}
