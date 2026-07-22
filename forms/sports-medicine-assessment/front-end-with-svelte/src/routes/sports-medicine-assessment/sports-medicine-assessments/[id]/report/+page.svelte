<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { clearanceLabel, clearanceColor, bmiCategory, calculateAge } from '$lib/engine/utils';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/sports-medicine-assessment/sports-medicine-assessments/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/sports-medicine-assessments/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `sports-medicine-assessment-${data.demographics.lastName || id}.pdf`;
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
			<h1 class="text-lg font-bold text-base-content">Sports medicine assessment report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/sports-medicine-assessment/sports-medicine-assessments/${id}`)}>Edit</Button>
			</div>
		</div>
	</header>

	<main class="mx-16 px-4 py-6">
		<!-- Clearance banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {clearanceColor(result.clearance)}">
			<div class="text-3xl font-bold">{clearanceLabel(result.clearance)}</div>
			<div class="mt-2 text-sm opacity-75">
				Based on {result.answeredCount} field{result.answeredCount === 1 ? '' : 's'} answered and
				{result.firedRules.length} rule{result.firedRules.length === 1 ? '' : 's'} fired ·
				generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- Flagged issues -->
		{#if result.additionalFlags.length > 0}
			<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-error">Flagged issues for the clinician</h2>
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

		<!-- Fired rules -->
		{#if result.firedRules.length > 0}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">PPE rule audit (clearance justification)</h2>
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b border-base-300 text-left text-base-content/70">
							<th class="pb-2 pr-4">Rule</th>
							<th class="pb-2 pr-4">Category</th>
							<th class="pb-2 pr-4">Finding</th>
							<th class="pb-2">Grade</th>
						</tr>
					</thead>
					<tbody>
						{#each result.firedRules as rule (rule.id)}
							<tr class="border-b border-base-200">
								<td class="py-2 pr-4 font-mono text-xs text-base-content/60">{rule.id}</td>
								<td class="py-2 pr-4">{rule.category}</td>
								<td class="py-2 pr-4">{rule.description}</td>
								<td class="py-2"><Badge grade={rule.grade} /></td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{:else}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6 text-sm text-base-content/70">
				No PPE rules fired — no clearance concerns identified.
			</div>
		{/if}

		<!-- Athlete summary -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Athlete summary</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div><span class="font-medium text-base-content/70">Name:</span> {data.demographics.firstName} {data.demographics.lastName}</div>
				<div>
					<span class="font-medium text-base-content/70">DOB:</span> {data.demographics.dateOfBirth}
					{#if calculateAge(data.demographics.dateOfBirth)}(Age {calculateAge(data.demographics.dateOfBirth)}){/if}
				</div>
				<div><span class="font-medium text-base-content/70">Sex:</span> {data.demographics.sex}</div>
				<div>
					<span class="font-medium text-base-content/70">BMI:</span> {data.demographics.bmi ?? 'N/A'}
					{#if data.demographics.bmi}({bmiCategory(data.demographics.bmi)}){/if}
				</div>
				<div><span class="font-medium text-base-content/70">Sport:</span> {data.sportPositionDetails.primarySport || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Position:</span> {data.sportPositionDetails.primaryPosition || 'N/A'}</div>
			</div>
		</div>

		<!-- Clinician decision -->
		{#if data.clearanceDecision.preferredClearance || data.clearanceDecision.clinicianName}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Clinician decision</h2>
				<div class="space-y-2 text-sm text-base-content/80">
					{#if data.clearanceDecision.preferredClearance}
						<div><span class="font-medium text-base-content/70">Preferred clearance:</span> {clearanceLabel(data.clearanceDecision.preferredClearance)}</div>
					{/if}
					{#if data.clearanceDecision.clearanceConditions}
						<div><span class="font-medium text-base-content/70">Conditions:</span> {data.clearanceDecision.clearanceConditions}</div>
					{/if}
					{#if data.clearanceDecision.followUpRequired}
						<div><span class="font-medium text-base-content/70">Follow-up:</span> {data.clearanceDecision.followUpRequired}</div>
					{/if}
					{#if data.clearanceDecision.clinicianName}
						<div><span class="font-medium text-base-content/70">Clinician:</span> {data.clearanceDecision.clinicianName} {data.clearanceDecision.clinicianSignatureDate ? `(${data.clearanceDecision.clinicianSignatureDate})` : ''}</div>
					{/if}
					{#if data.clearanceDecision.additionalNotes}
						<div><span class="font-medium text-base-content/70">Notes:</span> {data.clearanceDecision.additionalNotes}</div>
					{/if}
				</div>
			</div>
		{/if}
	</main>
{/if}
