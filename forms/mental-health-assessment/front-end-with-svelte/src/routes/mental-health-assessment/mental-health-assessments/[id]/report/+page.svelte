<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { severityColor, severityLabel, calculateAge } from '#lib/engine/utils.js';
	import Button from '#lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/mental-health-assessment/mental-health-assessments/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/mental-health-assessments/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `mental-health-assessment-${data.demographics.lastName || id}.pdf`;
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
			<h1 class="text-lg font-bold text-base-content">Mental health assessment report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/mental-health-assessment/mental-health-assessments/${id}`)}>Edit</Button>
			</div>
		</div>
	</header>

	<main class="mx-16 px-4 py-6">
		<!-- Score banners -->
		<div class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
			<div class="rounded-xl border-2 p-6 text-center {severityColor(result.phq9.severity)}">
				<div class="text-sm font-medium opacity-75">PHQ-9 Depression</div>
				<div class="text-3xl font-bold">{result.phq9.score}/{result.phq9.maxScore}</div>
				<div class="mt-1 text-sm">{severityLabel(result.phq9.severity)}</div>
			</div>
			<div class="rounded-xl border-2 p-6 text-center {severityColor(result.gad7.severity)}">
				<div class="text-sm font-medium opacity-75">GAD-7 Anxiety</div>
				<div class="text-3xl font-bold">{result.gad7.score}/{result.gad7.maxScore}</div>
				<div class="mt-1 text-sm">{severityLabel(result.gad7.severity)}</div>
			</div>
		</div>

		<!-- Timestamp -->
		<div class="mb-6 text-center text-sm text-base-content/60">
			Generated {new Date(result.timestamp).toLocaleString()}
		</div>

		<!-- Flagged issues -->
		{#if result.additionalFlags.length > 0}
			<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-error">Flagged issues for clinician</h2>
				<div class="space-y-2">
					{#each result.additionalFlags as flag (flag.id)}
						<div class="flex items-start gap-3 rounded-lg border p-3 {priorityColor[flag.priority]}">
							<span class="mt-0.5 rounded px-2 py-0.5 text-xs font-bold uppercase {priorityColor[flag.priority]}">
								{flag.priority}
							</span>
							<div>
								<span class="font-medium">{flag.category}:</span>
								{flag.message}
							</div>
						</div>
					{/each}
				</div>
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
					{#if calculateAge(data.demographics.dateOfBirth)}
						(Age {calculateAge(data.demographics.dateOfBirth)})
					{/if}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Sex:</span>
					{data.demographics.sex}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Emergency contact:</span>
					{data.demographics.emergencyContactName} ({data.demographics.emergencyContactRelationship})
				</div>
			</div>
		</div>

		<!-- Risk assessment summary -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Risk assessment</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div>
					<span class="font-medium text-base-content/70">Suicidal ideation:</span>
					{data.riskAssessment.suicidalIdeation || 'Not assessed'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Self-harm:</span>
					{data.riskAssessment.selfHarm || 'Not assessed'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Harm to others:</span>
					{data.riskAssessment.harmToOthers || 'Not assessed'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Safety plan:</span>
					{data.riskAssessment.hasSafetyPlan || 'N/A'}
				</div>
			</div>
		</div>

		<!-- Medications -->
		{#if data.currentMedications.psychiatricMedications.length > 0 || data.currentMedications.otherMedications.length > 0}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Medications</h2>
				{#if data.currentMedications.psychiatricMedications.length > 0}
					<h3 class="mb-2 text-sm font-semibold text-base-content/70">Psychiatric</h3>
					<ul class="mb-4 list-disc space-y-1 pl-5 text-sm text-base-content/80">
						{#each data.currentMedications.psychiatricMedications as med (med.name)}
							<li>{med.name} {med.dose} {med.frequency}</li>
						{/each}
					</ul>
				{/if}
				{#if data.currentMedications.otherMedications.length > 0}
					<h3 class="mb-2 text-sm font-semibold text-base-content/70">Other</h3>
					<ul class="list-disc space-y-1 pl-5 text-sm text-base-content/80">
						{#each data.currentMedications.otherMedications as med (med.name)}
							<li>{med.name} {med.dose} {med.frequency}</li>
						{/each}
					</ul>
				{/if}
			</div>
		{/if}
	</main>
{/if}
