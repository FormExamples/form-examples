<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { dashScoreColor, calculateAge, sideLabel, onsetTypeLabel } from '$lib/engine/utils';
	import Button from '$lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/orthopedic-assessment/orthopedic-assessments/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/orthopedic-assessments/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `orthopedic-assessment-${data.demographics.lastName || id}.pdf`;
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
			<h1 class="text-lg font-bold text-base-content">Orthopedic assessment report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/orthopedic-assessment/orthopedic-assessments/${id}`)}>Edit</Button>
			</div>
		</div>
	</header>

	<main class="mx-16 px-4 py-6">
		<!-- DASH score banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {result.dashScore !== null ? dashScoreColor(result.dashScore) : 'bg-base-300 text-base-content border-base-300'}">
			{#if result.dashScore !== null}
				<div class="text-3xl font-bold">DASH {result.dashScore}/100</div>
			{:else}
				<div class="text-3xl font-bold">DASH score unavailable</div>
			{/if}
			<div class="mt-1 text-lg">{result.dashCategory}</div>
			<div class="mt-2 text-sm opacity-75">
				Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- Flagged issues -->
		{#if result.additionalFlags.length > 0}
			<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-error">Flagged issues for orthopedic surgeon</h2>
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

		<!-- DASH breakdown -->
		{#if result.firedRules.length > 0}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">DASH score breakdown</h2>
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b border-base-300 text-left text-base-content/70">
							<th class="pb-2 pr-4">Question</th>
							<th class="pb-2 pr-4">Domain</th>
							<th class="pb-2 pr-4">Item</th>
							<th class="pb-2">Score</th>
						</tr>
					</thead>
					<tbody>
						{#each result.firedRules as rule (rule.id)}
							<tr class="border-b border-base-200">
								<td class="py-2 pr-4 font-mono text-xs text-base-content/60">{rule.id}</td>
								<td class="py-2 pr-4">{rule.domain}</td>
								<td class="py-2 pr-4">{rule.description}</td>
								<td class="py-2 font-bold">{rule.score}/5</td>
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
				<div><span class="font-medium text-base-content/70">Name:</span> {data.demographics.firstName} {data.demographics.lastName}</div>
				<div>
					<span class="font-medium text-base-content/70">DOB:</span> {data.demographics.dateOfBirth}
					{#if calculateAge(data.demographics.dateOfBirth)}(Age {calculateAge(data.demographics.dateOfBirth)}){/if}
				</div>
				<div><span class="font-medium text-base-content/70">Sex:</span> {data.demographics.sex}</div>
				<div><span class="font-medium text-base-content/70">Dominant hand:</span> {data.demographics.dominantHand || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Occupation:</span> {data.demographics.occupation || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Affected joint:</span> {data.chiefComplaint.affectedJoint} ({sideLabel(data.chiefComplaint.side)})</div>
				<div class="sm:col-span-2"><span class="font-medium text-base-content/70">Primary concern:</span> {data.chiefComplaint.primaryConcern}</div>
				<div><span class="font-medium text-base-content/70">Duration:</span> {data.chiefComplaint.duration}</div>
				<div><span class="font-medium text-base-content/70">Onset:</span> {onsetTypeLabel(data.chiefComplaint.onsetType)}</div>
				<div><span class="font-medium text-base-content/70">Current pain:</span> {data.painAssessment.currentPainLevel !== null ? `${data.painAssessment.currentPainLevel}/10` : 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Worst pain:</span> {data.painAssessment.worstPain !== null ? `${data.painAssessment.worstPain}/10` : 'N/A'}</div>
			</div>
		</div>

		<!-- Medications -->
		{#if data.currentTreatment.medications.length > 0}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Current medications</h2>
				<ul class="list-disc space-y-1 pl-5 text-sm text-base-content/80">
					{#each data.currentTreatment.medications as med (med.name)}
						<li>{med.name} {med.dose} {med.frequency}</li>
					{/each}
				</ul>
			</div>
		{/if}

		<!-- Allergies -->
		{#if data.currentTreatment.allergies.length > 0}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Drug allergies</h2>
				<ul class="list-disc space-y-1 pl-5 text-sm text-base-content/80">
					{#each data.currentTreatment.allergies as allergy (allergy.allergen)}
						<li>
							<strong>{allergy.allergen}</strong> — {allergy.reaction}
							{#if allergy.severity}
								<span class="ml-1 rounded px-1.5 py-0.5 text-xs {allergy.severity === 'anaphylaxis' ? 'bg-error text-error-content' : 'bg-warning text-warning-content'}">
									{allergy.severity}
								</span>
							{/if}
						</li>
					{/each}
				</ul>
			</div>
		{/if}
	</main>
{/if}
