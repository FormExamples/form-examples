<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { mcasScoreColor, calculateAge } from '$lib/engine/utils';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/mast-cell-activation-syndrome-assessments/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/mast-cell-activation-syndrome-assessments/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `mcas-assessment-${data.demographics.lastName || id}.pdf`;
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
			<h1 class="text-lg font-bold text-base-content">MCAS assessment report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button
					data-variant="secondary"
					onclick={() => goto(`/mast-cell-activation-syndrome-assessments/${id}`)}>Edit</Button
				>
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-4xl px-4 py-6">
		<!-- MCAS score banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {mcasScoreColor(result.symptomScore)}">
			<div class="text-3xl font-bold">MCAS Symptom Score {result.symptomScore}/40</div>
			<div class="mt-1 text-lg">{result.mcasCategory} symptom burden</div>
			<div class="mt-1 text-sm">{result.organSystemsAffected} organ system(s) affected</div>
			<div class="mt-3 flex justify-center">
				<Badge score={result.symptomScore} />
			</div>
			<div class="mt-2 text-sm opacity-75">
				Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- Flagged issues -->
		{#if result.additionalFlags.length > 0}
			<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-error">Flagged issues for clinician</h2>
				<div class="space-y-2">
					{#each result.additionalFlags as flag (flag.id)}
						<div class="flex items-start gap-3 rounded-lg border p-3 {priorityColor[flag.priority]}">
							<span
								class="mt-0.5 rounded px-2 py-0.5 text-xs font-bold uppercase {priorityColor[
									flag.priority
								]}"
							>
								{flag.priority}
							</span>
							<div><span class="font-medium">{flag.category}:</span> {flag.message}</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Symptom score breakdown -->
		{#if result.firedRules.length > 0}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Symptom score breakdown</h2>
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b border-base-300 text-left text-base-content/70">
							<th class="pb-2 pr-4">ID</th>
							<th class="pb-2 pr-4">Organ system</th>
							<th class="pb-2 pr-4">Symptom</th>
							<th class="pb-2">Score</th>
						</tr>
					</thead>
					<tbody>
						{#each result.firedRules as rule (rule.id)}
							<tr class="border-b border-base-200">
								<td class="py-2 pr-4 font-mono text-xs text-base-content/60">{rule.id}</td>
								<td class="py-2 pr-4">{rule.domain}</td>
								<td class="py-2 pr-4">{rule.description}</td>
								<td class="py-2 font-bold">{rule.score}/3</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}

		<!-- Patient summary -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Patient summary</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div>
					<span class="font-medium text-base-content/70">Name:</span>
					{data.demographics.firstName} {data.demographics.lastName}
				</div>
				<div>
					<span class="font-medium text-base-content/70">DOB:</span>
					{data.demographics.dateOfBirth}
					{#if calculateAge(data.demographics.dateOfBirth)}(Age {calculateAge(
							data.demographics.dateOfBirth
						)}){/if}
				</div>
				<div><span class="font-medium text-base-content/70">Sex:</span> {data.demographics.sex}</div>
				<div>
					<span class="font-medium text-base-content/70">Symptom duration:</span>
					{data.symptomOverview.symptomDuration || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Symptom frequency:</span>
					{data.symptomOverview.symptomFrequency || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Quality of life impact:</span>
					{data.symptomOverview.qualityOfLife || 'N/A'}
				</div>
			</div>
		</div>

		<!-- Triggers -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Triggers and patterns</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				{#if data.triggersPatterns.foodTriggers}
					<div class="sm:col-span-2">
						<span class="font-medium text-base-content/70">Food triggers:</span>
						{data.triggersPatterns.foodTriggers}
					</div>
				{/if}
				{#if data.triggersPatterns.environmentalTriggers}
					<div class="sm:col-span-2">
						<span class="font-medium text-base-content/70">Environmental triggers:</span>
						{data.triggersPatterns.environmentalTriggers}
					</div>
				{/if}
				<div>
					<span class="font-medium text-base-content/70">Stress trigger:</span>
					{data.triggersPatterns.stressTriggers || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Exercise trigger:</span>
					{data.triggersPatterns.exerciseTrigger || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Temperature trigger:</span>
					{data.triggersPatterns.temperatureTrigger || 'N/A'}
				</div>
				{#if data.triggersPatterns.medicationTriggers}
					<div class="sm:col-span-2">
						<span class="font-medium text-base-content/70">Medication triggers:</span>
						{data.triggersPatterns.medicationTriggers}
					</div>
				{/if}
			</div>
		</div>

		<!-- Laboratory results -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Laboratory results</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div>
					<span class="font-medium text-base-content/70">Serum tryptase:</span>
					{data.laboratoryResults.serumTryptase !== null
						? `${data.laboratoryResults.serumTryptase} ng/mL`
						: 'Not tested'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Plasma histamine:</span>
					{data.laboratoryResults.histamine !== null
						? `${data.laboratoryResults.histamine} ng/mL`
						: 'Not tested'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Prostaglandin D2:</span>
					{data.laboratoryResults.prostaglandinD2 !== null
						? `${data.laboratoryResults.prostaglandinD2} ng/mL`
						: 'Not tested'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Chromogranin A:</span>
					{data.laboratoryResults.chromograninA !== null
						? `${data.laboratoryResults.chromograninA} ng/mL`
						: 'Not tested'}
				</div>
			</div>
		</div>

		<!-- Current treatment -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Current treatment</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div>
					<span class="font-medium text-base-content/70">Antihistamines:</span>
					{data.currentTreatment.antihistamines || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Mast cell stabilizers:</span>
					{data.currentTreatment.mastCellStabilizers || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Leukotriene inhibitors:</span>
					{data.currentTreatment.leukotrienInhibitors || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Epinephrine auto-injector:</span>
					{data.currentTreatment.epinephrine || 'N/A'}
				</div>
			</div>
		</div>
	</main>
{/if}
