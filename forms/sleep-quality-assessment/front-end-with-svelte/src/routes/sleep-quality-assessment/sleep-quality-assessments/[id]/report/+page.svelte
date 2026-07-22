<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { psqiScoreColor, calculateAge, sleepEfficiencyCalc } from '$lib/engine/utils';
	import Button from '$lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/sleep-quality-assessment/sleep-quality-assessments/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/sleep-quality-assessments/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `sleep-quality-assessment-${data.demographics.lastName || id}.pdf`;
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
			<h1 class="text-lg font-bold text-base-content">Sleep quality assessment report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/sleep-quality-assessment/sleep-quality-assessments/${id}`)}>Edit</Button>
			</div>
		</div>
	</header>

	<main class="mx-16 px-4 py-6">
		<!-- PSQI score banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {psqiScoreColor(result.psqiScore)}">
			<div class="text-3xl font-bold">PSQI {result.psqiScore}/21</div>
			<div class="mt-1 text-lg">{result.psqiCategory}</div>
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
							<span class="mt-0.5 rounded px-2 py-0.5 text-xs font-bold uppercase {priorityColor[flag.priority]}">
								{flag.priority}
							</span>
							<div><span class="font-medium">{flag.category}:</span> {flag.message}</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- PSQI breakdown -->
		{#if result.firedRules.length > 0}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">PSQI score breakdown</h2>
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b border-base-300 text-left text-base-content/70">
							<th class="pb-2 pr-4">Component</th>
							<th class="pb-2 pr-4">Name</th>
							<th class="pb-2 pr-4">Details</th>
							<th class="pb-2">Score</th>
						</tr>
					</thead>
					<tbody>
						{#each result.firedRules as rule (rule.id)}
							<tr class="border-b border-base-200">
								<td class="py-2 pr-4 font-mono text-xs text-base-content/60">{rule.id}</td>
								<td class="py-2 pr-4">{rule.component}</td>
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
				<div><span class="font-medium text-base-content/70">Name:</span> {data.demographics.firstName} {data.demographics.lastName}</div>
				<div>
					<span class="font-medium text-base-content/70">DOB:</span> {data.demographics.dateOfBirth}
					{#if calculateAge(data.demographics.dateOfBirth)}(Age {calculateAge(data.demographics.dateOfBirth)}){/if}
				</div>
				<div><span class="font-medium text-base-content/70">Sex:</span> {data.demographics.sex}</div>
				<div><span class="font-medium text-base-content/70">Sleep environment:</span> {data.sleepHabits.sleepEnvironment || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Usual bedtime:</span> {data.sleepHabits.usualBedtime || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Usual wake time:</span> {data.sleepHabits.usualWakeTime || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Hours of sleep:</span> {data.sleepDuration.actualSleepHours ?? 'N/A'}</div>
				<div>
					<span class="font-medium text-base-content/70">Sleep efficiency:</span>
					{#if sleepEfficiencyCalc(data.sleepEfficiency.hoursAsleep, data.sleepEfficiency.hoursInBed) !== null}
						{sleepEfficiencyCalc(data.sleepEfficiency.hoursAsleep, data.sleepEfficiency.hoursInBed)?.toFixed(1)}%
					{:else}
						N/A
					{/if}
				</div>
			</div>
		</div>

		<!-- Lifestyle factors -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Lifestyle factors</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div><span class="font-medium text-base-content/70">Caffeine:</span> {data.medicalLifestyle.caffeineIntake || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Alcohol:</span> {data.medicalLifestyle.alcoholUse || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Exercise:</span> {data.medicalLifestyle.exerciseFrequency || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Screen time before bed:</span> {data.medicalLifestyle.screenTimeBeforeBed || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Shift work:</span> {data.medicalLifestyle.shiftWork || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Driving drowsiness:</span> {data.daytimeDysfunction.drivingDrowsiness || 'N/A'}</div>
			</div>
			{#if data.medicalLifestyle.medicalConditions}
				<div class="mt-4">
					<span class="font-medium text-base-content/70">Medical conditions:</span>
					<p class="mt-1 text-sm">{data.medicalLifestyle.medicalConditions}</p>
				</div>
			{/if}
			{#if data.medicalLifestyle.currentMedications}
				<div class="mt-4">
					<span class="font-medium text-base-content/70">Current medications:</span>
					<p class="mt-1 text-sm">{data.medicalLifestyle.currentMedications}</p>
				</div>
			{/if}
		</div>
	</main>
{/if}
