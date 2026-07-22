<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { eligibilityLabel, eligibilityColor, calculateAge } from '$lib/engine/utils';
	import Button from '$lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/semaglutide-assessment/semaglutide-assessments/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/semaglutide-assessments/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `semaglutide-assessment-${data.demographics.lastName || id}.pdf`;
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
			<h1 class="text-lg font-bold text-base-content">Semaglutide assessment report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/semaglutide-assessment/semaglutide-assessments/${id}`)}>Edit</Button>
			</div>
		</div>
	</header>

	<main class="mx-16 px-4 py-6">
		<!-- Eligibility status banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {eligibilityColor(result.eligibilityStatus)}">
			<div class="text-3xl font-bold">{result.eligibilityStatus}</div>
			<div class="mt-1 text-lg">{eligibilityLabel(result.eligibilityStatus)}</div>
			{#if result.bmi !== null}
				<div class="mt-2 text-sm">BMI: {result.bmi.toFixed(1)} ({result.bmiCategory})</div>
			{/if}
			<div class="mt-2 text-sm opacity-75">
				Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- Absolute contraindications -->
		{#if result.absoluteContraindications.length > 0}
			<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-error">Absolute contraindications</h2>
				<div class="space-y-2">
					{#each result.absoluteContraindications as rule (rule.id)}
						<div class="flex items-start gap-3 rounded-lg border border-error bg-error/10 p-3">
							<span class="mt-0.5 rounded px-2 py-0.5 text-xs font-bold uppercase bg-error text-error-content">
								{rule.category}
							</span>
							<div class="text-sm text-base-content">{rule.description}</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Relative contraindications -->
		{#if result.relativeContraindications.length > 0}
			<div class="mb-6 rounded-xl border border-warning/40 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-warning">Relative contraindications</h2>
				<div class="space-y-2">
					{#each result.relativeContraindications as rule (rule.id)}
						<div class="flex items-start gap-3 rounded-lg border border-warning bg-warning/10 p-3">
							<span class="mt-0.5 rounded px-2 py-0.5 text-xs font-bold uppercase bg-warning text-warning-content">
								{rule.category}
							</span>
							<div class="text-sm text-base-content">{rule.description}</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Monitoring flags -->
		{#if result.monitoringFlags.length > 0}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Flagged issues for clinician</h2>
				<div class="space-y-2">
					{#each result.monitoringFlags as flag (flag.id)}
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

		<!-- Patient summary -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Patient summary</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div><span class="font-medium text-base-content/70">Name:</span> {data.demographics.firstName} {data.demographics.lastName}</div>
				<div>
					<span class="font-medium text-base-content/70">DOB:</span> {data.demographics.dob}
					{#if calculateAge(data.demographics.dob)}(Age {calculateAge(data.demographics.dob)}){/if}
				</div>
				<div><span class="font-medium text-base-content/70">Sex:</span> {data.demographics.sex || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Primary indication:</span> {data.indicationGoals.primaryIndication || 'N/A'}</div>
				{#if data.indicationGoals.weightLossGoalPercent !== null}
					<div><span class="font-medium text-base-content/70">Weight loss goal:</span> {data.indicationGoals.weightLossGoalPercent}%</div>
				{/if}
				<div><span class="font-medium text-base-content/70">Motivation:</span> {data.indicationGoals.motivationLevel || 'N/A'}</div>
			</div>
		</div>

		<!-- Metabolic profile -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Metabolic profile</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				{#if data.metabolicProfile.hba1c !== null}
					<div><span class="font-medium text-base-content/70">HbA1c:</span> {data.metabolicProfile.hba1c}%</div>
				{/if}
				{#if data.metabolicProfile.fastingGlucose !== null}
					<div><span class="font-medium text-base-content/70">Fasting glucose:</span> {data.metabolicProfile.fastingGlucose} mmol/L</div>
				{/if}
				{#if data.metabolicProfile.totalCholesterol !== null}
					<div><span class="font-medium text-base-content/70">Total cholesterol:</span> {data.metabolicProfile.totalCholesterol} mmol/L</div>
				{/if}
				{#if data.metabolicProfile.ldl !== null}
					<div><span class="font-medium text-base-content/70">LDL:</span> {data.metabolicProfile.ldl} mmol/L</div>
				{/if}
				{#if data.metabolicProfile.hdl !== null}
					<div><span class="font-medium text-base-content/70">HDL:</span> {data.metabolicProfile.hdl} mmol/L</div>
				{/if}
				{#if data.metabolicProfile.triglycerides !== null}
					<div><span class="font-medium text-base-content/70">Triglycerides:</span> {data.metabolicProfile.triglycerides} mmol/L</div>
				{/if}
				{#if data.metabolicProfile.thyroidFunction}
					<div><span class="font-medium text-base-content/70">Thyroid function:</span> {data.metabolicProfile.thyroidFunction}</div>
				{/if}
			</div>
		</div>

		<!-- Treatment plan -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Treatment plan</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div><span class="font-medium text-base-content/70">Formulation:</span> {data.treatmentPlan.selectedFormulation || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Starting dose:</span> {data.treatmentPlan.startingDose || 'N/A'}</div>
				{#if data.treatmentPlan.titrationSchedule}
					<div><span class="font-medium text-base-content/70">Titration:</span> {data.treatmentPlan.titrationSchedule}</div>
				{/if}
				{#if data.treatmentPlan.monitoringFrequency}
					<div><span class="font-medium text-base-content/70">Monitoring:</span> {data.treatmentPlan.monitoringFrequency}</div>
				{/if}
				<div><span class="font-medium text-base-content/70">Dietary guidance:</span> {data.treatmentPlan.dietaryGuidance || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Exercise plan:</span> {data.treatmentPlan.exercisePlan || 'N/A'}</div>
				{#if data.treatmentPlan.followUpWeeks !== null}
					<div><span class="font-medium text-base-content/70">Follow-up:</span> {data.treatmentPlan.followUpWeeks} weeks</div>
				{/if}
			</div>
		</div>
	</main>
{/if}
