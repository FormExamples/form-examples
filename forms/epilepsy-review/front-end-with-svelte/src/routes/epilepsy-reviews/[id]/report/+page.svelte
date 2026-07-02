<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import {
		seizureControlLabel,
		seizureControlColor,
		reviewStatusLabel,
		reviewStatusColor,
		priorityLabel,
		priorityColor,
		documentedColor,
		reviewerRoleLabel,
		careSettingLabel,
		sexLabel,
		ageBandLabel,
		epilepsyTypeLabel,
		seizureFrequencyLabel,
		seizureTrendLabel
	} from '$lib/engine/utils';
	import Button from '$lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/epilepsy-reviews/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/epilepsy-reviews/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `epilepsy-review-${data.profile.patientIdentifier || id}.pdf`;
				a.click();
				URL.revokeObjectURL(url);
			} else {
				pdfError = 'Failed to generate PDF. Please try again.';
			}
		} catch {
			pdfError = 'Failed to generate PDF. Please check your connection and try again.';
		}
	}

	const documentedCount = $derived(
		result ? result.componentStatuses.filter((c) => c.documented).length : 0
	);
</script>

{#if result}
	<header class="border-b border-base-300 bg-base-100 shadow-sm no-print">
		<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
			<h1 class="text-lg font-bold text-base-content">Epilepsy review report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/epilepsy-reviews/${id}`)}>Edit</Button>
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-4xl px-4 py-6">
		<!-- Control + completeness banner -->
		<div class="mb-6 grid gap-4 sm:grid-cols-2">
			<div class="rounded-xl border-2 p-6 text-center {seizureControlColor(result.seizureControl)}">
				<div class="text-3xl font-bold">{seizureControlLabel(result.seizureControl)}</div>
				<div class="mt-2 text-sm font-semibold">Seizure control</div>
			</div>
			<div class="rounded-xl border-2 p-6 text-center {reviewStatusColor(result.reviewStatus)}">
				<div class="text-3xl font-bold">Review: {reviewStatusLabel(result.reviewStatus)}</div>
				<div class="mt-2 text-sm font-semibold">
					{documentedCount} of {result.componentStatuses.length} required domains documented
				</div>
			</div>
		</div>

		<div class="mb-6 flex flex-wrap items-center justify-center gap-3 text-sm">
			<span class="text-base-content/60">Generated {new Date(result.timestamp).toLocaleString()}</span>
		</div>

		<!-- Interpretation -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-2 text-lg font-bold text-base-content">Interpretation</h2>
			<p class="text-sm text-base-content/80">
				{#if result.seizureControl === 'uncontrolled'}
					Seizure control is <strong>uncontrolled</strong> (frequent seizures, an increasing trend,
					or status epilepticus). Escalate to neurology / epilepsy specialist review for medication
					optimisation.
				{:else if result.seizureControl === 'controlled'}
					Seizures are present but <strong>stable or decreasing</strong>. Continue current management
					and monitor.
				{:else}
					The patient is <strong>seizure-free</strong> on the current regimen. Continue management
					and routine recall.
				{/if}
				{#if result.reviewStatus === 'complete'}
					All {result.componentStatuses.length} required review domains are recorded.
				{:else if result.reviewStatus === 'incomplete'}
					The review is <strong>incomplete</strong> — a core domain (seizure or medication) is not
					recorded.
				{:else}
					{result.componentStatuses.length - documentedCount} required review domain(s) remain
					<strong>outstanding</strong>.
				{/if}
			</p>
		</div>

		<!-- Review completeness -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Review completeness</h2>
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-base-300 text-left text-base-content/70">
						<th class="pb-2 pr-4">Domain</th>
						<th class="pb-2">Status</th>
					</tr>
				</thead>
				<tbody>
					{#each result.componentStatuses as c (c.component)}
						<tr class="border-b border-base-200">
							<td class="py-2 pr-4">{c.label}</td>
							<td class="py-2">
								<span
									class="rounded-full border px-2 py-0.5 text-xs font-bold {documentedColor(
										c.documented
									)}">{c.documented ? 'Recorded' : 'Outstanding'}</span
								>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<!-- Flagged issues -->
		{#if result.flags.length > 0}
			<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-error">Flagged issues ({result.flags.length})</h2>
				<div class="space-y-2">
					{#each result.flags as flag (flag.id)}
						<div class="flex items-start gap-3 rounded-lg border p-3 {priorityColor(flag.priority)}">
							<span
								class="mt-0.5 rounded px-2 py-0.5 text-xs font-bold uppercase {priorityColor(
									flag.priority
								)}"
							>
								{priorityLabel(flag.priority)}
							</span>
							<div>
								<span class="font-medium">{flag.category}:</span>
								{flag.description} — {flag.suggestedAction}
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Patient / context summary -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Review summary</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div>
					<span class="font-medium text-base-content/70">Patient ID:</span>
					{data.profile.patientIdentifier || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Age band:</span>
					{ageBandLabel(data.profile.ageBand) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Sex:</span>
					{sexLabel(data.profile.sex) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Epilepsy type:</span>
					{epilepsyTypeLabel(data.profile.epilepsyType) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Seizure frequency:</span>
					{seizureFrequencyLabel(data.seizures.seizureFrequency) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Trend:</span>
					{seizureTrendLabel(data.seizures.seizureTrend) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Reviewer:</span>
					{data.context.reviewerName || 'N/A'}
					{#if reviewerRoleLabel(data.context.reviewerRole)}
						({reviewerRoleLabel(data.context.reviewerRole)})
					{/if}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Care setting:</span>
					{careSettingLabel(data.context.careSetting) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Date of review:</span>
					{data.context.reviewedAt || 'N/A'}
				</div>
			</div>
			{#if data.summary.carePlan}
				<div class="mt-4 text-sm">
					<span class="font-medium text-base-content/70">Care plan:</span>
					<p class="mt-1 text-base-content/80">{data.summary.carePlan}</p>
				</div>
			{/if}
			{#if data.summary.reviewContext}
				<div class="mt-4 text-sm">
					<span class="font-medium text-base-content/70">Clinician note:</span>
					<p class="mt-1 text-base-content/80">{data.summary.reviewContext}</p>
				</div>
			{/if}
		</div>
	</main>
{/if}
