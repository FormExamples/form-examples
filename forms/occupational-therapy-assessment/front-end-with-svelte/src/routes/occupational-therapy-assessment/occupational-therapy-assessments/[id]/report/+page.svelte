<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { copmScoreColor, calculateAge, difficultyLabel, difficultyColor } from '$lib/engine/utils';
	import Button from '$lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/occupational-therapy-assessment/occupational-therapy-assessments/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/occupational-therapy-assessments/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `occupational-therapy-assessment-${data.demographics.lastName || id}.pdf`;
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
			<h1 class="text-lg font-bold text-base-content">Occupational therapy assessment report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/occupational-therapy-assessment/occupational-therapy-assessments/${id}`)}>Edit</Button>
			</div>
		</div>
	</header>

	<main class="mx-16 px-4 py-6">
		<!-- COPM score banners -->
		<div class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
			<div class="rounded-xl border-2 p-6 text-center {copmScoreColor(result.performanceScore)}">
				<div class="text-3xl font-bold">Performance {result.performanceScore}/10</div>
				<div class="mt-1 text-lg">{result.performanceCategory}</div>
			</div>
			<div class="rounded-xl border-2 p-6 text-center {copmScoreColor(result.satisfactionScore)}">
				<div class="text-3xl font-bold">Satisfaction {result.satisfactionScore}/10</div>
				<div class="mt-1 text-lg">{result.satisfactionCategory}</div>
			</div>
		</div>
		<div class="mb-6 text-center text-sm text-base-content/60">
			Generated {new Date(result.timestamp).toLocaleString()}
		</div>

		<!-- Flagged issues -->
		{#if result.additionalFlags.length > 0}
			<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-error">Flagged issues for occupational therapist</h2>
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

		<!-- COPM breakdown -->
		{#if result.firedRules.length > 0}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">COPM score breakdown</h2>
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b border-base-300 text-left text-base-content/70">
							<th class="pb-2 pr-4">ID</th>
							<th class="pb-2 pr-4">Domain</th>
							<th class="pb-2 pr-4">Activity</th>
							<th class="pb-2">Score</th>
						</tr>
					</thead>
					<tbody>
						{#each result.firedRules as rule (rule.id + rule.domain)}
							<tr class="border-b border-base-200">
								<td class="py-2 pr-4 font-mono text-xs text-base-content/60">{rule.id}</td>
								<td class="py-2 pr-4">{rule.domain}</td>
								<td class="py-2 pr-4">{rule.description}</td>
								<td class="py-2 font-bold">{rule.score}/10</td>
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
				<div><span class="font-medium text-base-content/70">Primary diagnosis:</span> {data.referralInfo.primaryDiagnosis || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Referral source:</span> {data.referralInfo.referralSource || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Referring clinician:</span> {data.referralInfo.referringClinician || 'N/A'}</div>
			</div>
		</div>

		<!-- Activity difficulty summary -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Activity difficulty summary</h2>
			<div class="space-y-4">
				<div>
					<h3 class="mb-2 text-sm font-semibold text-base-content/80">Self-care activities</h3>
					<div class="grid grid-cols-1 gap-2 text-sm sm:grid-cols-3">
						<div>
							<span class="text-base-content/70">Personal care:</span>
							{#if data.selfCareActivities.personalCare.difficulty}
								<span class="ml-1 rounded px-2 py-0.5 text-xs {difficultyColor(data.selfCareActivities.personalCare.difficulty)}">{difficultyLabel(data.selfCareActivities.personalCare.difficulty)}</span>
							{/if}
						</div>
						<div>
							<span class="text-base-content/70">Functional mobility:</span>
							{#if data.selfCareActivities.functionalMobility.difficulty}
								<span class="ml-1 rounded px-2 py-0.5 text-xs {difficultyColor(data.selfCareActivities.functionalMobility.difficulty)}">{difficultyLabel(data.selfCareActivities.functionalMobility.difficulty)}</span>
							{/if}
						</div>
						<div>
							<span class="text-base-content/70">Community management:</span>
							{#if data.selfCareActivities.communityManagement.difficulty}
								<span class="ml-1 rounded px-2 py-0.5 text-xs {difficultyColor(data.selfCareActivities.communityManagement.difficulty)}">{difficultyLabel(data.selfCareActivities.communityManagement.difficulty)}</span>
							{/if}
						</div>
					</div>
				</div>
				<div>
					<h3 class="mb-2 text-sm font-semibold text-base-content/80">Productivity activities</h3>
					<div class="grid grid-cols-1 gap-2 text-sm sm:grid-cols-3">
						<div>
							<span class="text-base-content/70">Paid work:</span>
							{#if data.productivityActivities.paidWork.difficulty}
								<span class="ml-1 rounded px-2 py-0.5 text-xs {difficultyColor(data.productivityActivities.paidWork.difficulty)}">{difficultyLabel(data.productivityActivities.paidWork.difficulty)}</span>
							{/if}
						</div>
						<div>
							<span class="text-base-content/70">Household:</span>
							{#if data.productivityActivities.householdManagement.difficulty}
								<span class="ml-1 rounded px-2 py-0.5 text-xs {difficultyColor(data.productivityActivities.householdManagement.difficulty)}">{difficultyLabel(data.productivityActivities.householdManagement.difficulty)}</span>
							{/if}
						</div>
						<div>
							<span class="text-base-content/70">Education:</span>
							{#if data.productivityActivities.education.difficulty}
								<span class="ml-1 rounded px-2 py-0.5 text-xs {difficultyColor(data.productivityActivities.education.difficulty)}">{difficultyLabel(data.productivityActivities.education.difficulty)}</span>
							{/if}
						</div>
					</div>
				</div>
				<div>
					<h3 class="mb-2 text-sm font-semibold text-base-content/80">Leisure activities</h3>
					<div class="grid grid-cols-1 gap-2 text-sm sm:grid-cols-3">
						<div>
							<span class="text-base-content/70">Quiet recreation:</span>
							{#if data.leisureActivities.quietRecreation.difficulty}
								<span class="ml-1 rounded px-2 py-0.5 text-xs {difficultyColor(data.leisureActivities.quietRecreation.difficulty)}">{difficultyLabel(data.leisureActivities.quietRecreation.difficulty)}</span>
							{/if}
						</div>
						<div>
							<span class="text-base-content/70">Active recreation:</span>
							{#if data.leisureActivities.activeRecreation.difficulty}
								<span class="ml-1 rounded px-2 py-0.5 text-xs {difficultyColor(data.leisureActivities.activeRecreation.difficulty)}">{difficultyLabel(data.leisureActivities.activeRecreation.difficulty)}</span>
							{/if}
						</div>
						<div>
							<span class="text-base-content/70">Social participation:</span>
							{#if data.leisureActivities.socialParticipation.difficulty}
								<span class="ml-1 rounded px-2 py-0.5 text-xs {difficultyColor(data.leisureActivities.socialParticipation.difficulty)}">{difficultyLabel(data.leisureActivities.socialParticipation.difficulty)}</span>
							{/if}
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Goals -->
		{#if data.goalsPriorities.shortTermGoals || data.goalsPriorities.longTermGoals || data.goalsPriorities.priorityAreas || data.goalsPriorities.dischargeGoals}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Goals &amp; priorities</h2>
				<div class="space-y-3 text-sm">
					{#if data.goalsPriorities.shortTermGoals}
						<div><span class="font-medium text-base-content/70">Short-term goals:</span><p class="mt-1">{data.goalsPriorities.shortTermGoals}</p></div>
					{/if}
					{#if data.goalsPriorities.longTermGoals}
						<div><span class="font-medium text-base-content/70">Long-term goals:</span><p class="mt-1">{data.goalsPriorities.longTermGoals}</p></div>
					{/if}
					{#if data.goalsPriorities.priorityAreas}
						<div><span class="font-medium text-base-content/70">Priority areas:</span><p class="mt-1">{data.goalsPriorities.priorityAreas}</p></div>
					{/if}
					{#if data.goalsPriorities.dischargeGoals}
						<div><span class="font-medium text-base-content/70">Discharge goals:</span><p class="mt-1">{data.goalsPriorities.dischargeGoals}</p></div>
					{/if}
				</div>
			</div>
		{/if}
	</main>
{/if}
