<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { requestStore } from '#lib/stores/request.svelte.js';
	import {
		appropriatenessLabel,
		appropriatenessColor,
		triageTierLabel,
		triageTierColor,
		priorityLabel,
		priorityBandColor,
		recommendationColor,
		priorityColor,
		examTypeLabel,
		indicationLabel,
		lateralityLabel,
		ageInYears
	} from '#lib/engine/utils.js';
	import Badge from '#lib/components/ui/Badge.svelte';
	import Button from '#lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(requestStore.data);
	const result = $derived(requestStore.result);

	$effect(() => {
		if (!requestStore.result) {
			goto(`/mammography-test-request/mammography-test-requests/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/mammography-test-requests/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: requestStore.data, result: requestStore.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `mammography-test-request-${data.patient.lastName || id}.pdf`;
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
			<h1 class="text-lg font-bold text-base-content">Mammography vetting report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/mammography-test-request/mammography-test-requests/${id}`)}>Edit</Button>
			</div>
		</div>
	</header>

	<main class="mx-16 px-4 py-6">
		<!-- Recommendation / triage banner -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6 text-center">
			<div class="text-2xl font-bold text-base-content">{result.recommendationLabel}</div>
			<div class="mt-3 flex flex-wrap justify-center gap-2">
				<Badge label={triageTierLabel(result.triageTier)} color={triageTierColor(result.triageTier)} />
				<Badge
					label={result.twoWeekWaitEligible ? 'Two-week-wait eligible' : 'Not two-week-wait'}
					color={result.twoWeekWaitEligible ? 'bg-error text-error-content border-error' : 'bg-base-300 text-base-content border-base-300'}
				/>
				<Badge label={result.recommendationLabel} color={recommendationColor(result.recommendation)} />
			</div>
			{#if result.targetTimeframe}
				<div class="mt-2 text-sm text-base-content/70">{result.targetTimeframe}</div>
			{/if}
			<div class="mt-2 text-sm text-base-content/60">
				Generated {new Date(result.gradedAt).toLocaleString()}
			</div>
		</div>

		<!-- Four-axis grade -->
		<div class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
			<div class="rounded-xl border border-base-300 bg-base-100 p-4">
				<div class="text-sm font-medium text-base-content/70">A · Appropriateness</div>
				<div class="mt-2 flex items-center gap-3">
					<span class="text-2xl font-bold text-base-content">{result.appropriatenessScore} / 9</span>
					<Badge label={appropriatenessLabel(result.appropriatenessBand)} color={appropriatenessColor(result.appropriatenessBand)} />
				</div>
			</div>
			<div class="rounded-xl border border-base-300 bg-base-100 p-4">
				<div class="text-sm font-medium text-base-content/70">B · Cancer-pathway urgency</div>
				<div class="mt-2">
					<Badge label={triageTierLabel(result.triageTier)} color={triageTierColor(result.triageTier)} />
				</div>
				{#if result.twoWeekWaitEligible && result.twoWeekWaitRationale}
					<div class="mt-2 text-xs text-base-content/60">{result.twoWeekWaitRationale}</div>
				{/if}
			</div>
			<div class="rounded-xl border border-base-300 bg-base-100 p-4">
				<div class="text-sm font-medium text-base-content/70">C · Completeness</div>
				<div class="mt-2 text-2xl font-bold text-base-content">{result.completenessPercent}%</div>
				<div class="mt-2 h-2 w-full overflow-hidden rounded-full bg-base-300">
					<div class="h-full bg-primary" style={`width:${result.completenessPercent}%`}></div>
				</div>
			</div>
			<div class="rounded-xl border border-base-300 bg-base-100 p-4">
				<div class="text-sm font-medium text-base-content/70">D · Clinical priority</div>
				<div class="mt-2">
					<Badge label={priorityLabel(result.priorityBand)} color={priorityBandColor(result.priorityBand)} />
				</div>
			</div>
		</div>

		<!-- Safety flags -->
		{#if result.flags.length > 0}
			<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-error">Safety flags</h2>
				<div class="space-y-2">
					{#each result.flags as flag (flag.flagId)}
						<div class="flex items-start gap-3 rounded-lg border p-3 {priorityColor(flag.priority)}">
							<span class="mt-0.5 rounded px-2 py-0.5 text-xs font-bold uppercase {priorityColor(flag.priority)}">
								{flag.priority}
							</span>
							<div>
								<span class="font-medium">{flag.category}:</span>
								{flag.description}
								<div class="mt-1 text-sm opacity-80">{flag.suggestedAction}</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Fired rules -->
		{#if result.firedRules.length > 0}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Grading justification</h2>
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b border-base-300 text-left text-base-content/70">
							<th class="pb-2 pr-4">Rule</th>
							<th class="pb-2 pr-4">Axis</th>
							<th class="pb-2">Description</th>
						</tr>
					</thead>
					<tbody>
						{#each result.firedRules as rule (rule.ruleId)}
							<tr class="border-b border-base-200">
								<td class="py-2 pr-4 font-mono text-xs text-base-content/60">{rule.ruleId}</td>
								<td class="py-2 pr-4">{rule.axis}</td>
								<td class="py-2">{rule.description}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}

		<!-- Request summary -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Request summary</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div><span class="font-medium text-base-content/70">Patient:</span> {data.patient.firstName} {data.patient.lastName}</div>
				<div>
					<span class="font-medium text-base-content/70">DOB:</span> {data.patient.dateOfBirth || 'N/A'}
					{#if ageInYears(data.patient.dateOfBirth) !== null}(Age {ageInYears(data.patient.dateOfBirth)}){/if}
				</div>
				<div><span class="font-medium text-base-content/70">NHS number:</span> {data.patient.nhsNumber || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Exam:</span> {examTypeLabel(data.request.examType)} · {lateralityLabel(data.request.laterality)}</div>
				<div><span class="font-medium text-base-content/70">Indication:</span> {indicationLabel(data.request.primaryIndication)}</div>
				<div><span class="font-medium text-base-content/70">Clinician:</span> {data.clinician.clinicianName || 'N/A'}</div>
			</div>
			{#if data.request.clinicalQuestion}
				<div class="mt-4 text-sm">
					<span class="font-medium text-base-content/70">Clinical question:</span>
					{data.request.clinicalQuestion}
				</div>
			{/if}
		</div>
	</main>
{/if}
