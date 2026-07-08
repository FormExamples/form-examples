<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import {
		controlStatusLabel,
		controlStatusColor,
		reviewStatusLabel,
		reviewStatusColor,
		hypertensionStageLabel,
		hypertensionStageColor,
		primarySourceLabel,
		priorityLabel,
		priorityColor,
		documentedColor,
		clinicianRoleLabel,
		sexLabel,
		ageBandLabel,
		ethnicityLabel
	} from '$lib/engine/utils';
	import Button from '$lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/hypertension-review/hypertension-reviews/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/hypertension-reviews/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `hypertension-review-${data.identification.patientIdentifier || id}.pdf`;
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
	const notClassified = $derived(result ? result.controlStatus.primarySource === 'none' : true);
</script>

{#if result}
	<header class="border-b border-base-300 bg-base-100 shadow-sm no-print">
		<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
			<h1 class="text-lg font-bold text-base-content">Hypertension review report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/hypertension-review/hypertension-reviews/${id}`)}
					>Edit</Button
				>
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-4xl px-4 py-6">
		<!-- Control + completeness banner -->
		<div class="mb-6 grid gap-4 sm:grid-cols-2">
			<div
				class="rounded-xl border-2 p-6 text-center {notClassified
					? 'bg-base-300 text-base-content border-base-300'
					: controlStatusColor(result.controlStatus.controlClass)}"
			>
				<div class="text-3xl font-bold">
					{notClassified ? 'Not classified' : controlStatusLabel(result.controlStatus.controlClass)}
				</div>
				<div class="mt-2 text-sm font-semibold">
					{#if notClassified}
						No blood-pressure reading recorded
					{:else}
						Primary reading: {primarySourceLabel(result.controlStatus.primarySource)}
					{/if}
				</div>
			</div>
			<div class="rounded-xl border-2 p-6 text-center {reviewStatusColor(result.reviewStatus)}">
				<div class="text-3xl font-bold">Review: {reviewStatusLabel(result.reviewStatus)}</div>
				<div class="mt-2 text-sm font-semibold">
					{documentedCount} of {result.componentStatuses.length} components documented
				</div>
			</div>
		</div>

		<div class="mb-6 flex flex-wrap items-center justify-center gap-3 text-sm">
			<span
				class="rounded-full border px-3 py-1 font-bold {hypertensionStageColor(
					result.controlStatus.hypertensionStage
				)}">Stage: {hypertensionStageLabel(result.controlStatus.hypertensionStage)}</span
			>
			<span class="text-base-content/60">Generated {new Date(result.timestamp).toLocaleString()}</span>
		</div>

		<!-- Blood-pressure target -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-2 text-lg font-bold text-base-content">Blood-pressure target</h2>
			<p class="text-sm text-base-content/80">
				Group: <strong>{result.controlStatus.bpTarget.group}</strong>. Clinic target
				<strong
					>{result.controlStatus.bpTarget.clinic.systolic}/{result.controlStatus.bpTarget.clinic
						.diastolic}</strong
				>
				mmHg; home/ambulatory target
				<strong
					>{result.controlStatus.bpTarget.home.systolic}/{result.controlStatus.bpTarget.home
						.diastolic}</strong
				>
				mmHg. Primary reading source:
				<strong>{primarySourceLabel(result.controlStatus.primarySource) || 'None'}</strong>.
			</p>
		</div>

		<!-- Interpretation -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-2 text-lg font-bold text-base-content">Interpretation</h2>
			<p class="text-sm text-base-content/80">
				{#if notClassified}
					No blood-pressure reading was recorded, so control cannot be classified. Record a clinic
					or home/ambulatory reading to complete the review.
				{:else if result.controlStatus.controlClass === 'severe-uncontrolled'}
					Clinic blood pressure is <strong>180/120 mmHg or above</strong>. Arrange
					<strong>same-day</strong> clinical assessment for accelerated hypertension and target-organ
					damage.
				{:else if result.controlStatus.controlClass === 'uncontrolled'}
					Blood pressure is <strong>above the applicable target</strong>. Review adherence and step
					up antihypertensive medication per NICE NG136.
				{:else}
					Blood pressure is <strong>at or below the applicable target</strong>. Continue current
					management and routine recall.
				{/if}
				{#if result.reviewStatus === 'complete'}
					All {result.componentStatuses.length} review components are recorded.
				{:else if result.reviewStatus === 'incomplete'}
					The review is <strong>incomplete</strong> — no blood pressure was recorded.
				{:else}
					{result.componentStatuses.length - documentedCount} review component(s) remain
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
						<th class="pb-2 pr-4">Component</th>
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
					{data.identification.patientIdentifier || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Age band:</span>
					{ageBandLabel(data.identification.ageBand) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Sex:</span>
					{sexLabel(data.identification.sex) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Ethnicity:</span>
					{ethnicityLabel(data.identification.ethnicity) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Clinician:</span>
					{data.context.clinicianName || 'N/A'}
					{#if clinicianRoleLabel(data.context.clinicianRole)}
						({clinicianRoleLabel(data.context.clinicianRole)})
					{/if}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Date of review:</span>
					{data.context.reviewedAt || 'N/A'}
				</div>
			</div>
			{#if data.complications.complications}
				<div class="mt-4 text-sm">
					<span class="font-medium text-base-content/70">Complications:</span>
					<p class="mt-1 text-base-content/80">{data.complications.complications}</p>
				</div>
			{/if}
			{#if data.summary.reviewContext}
				<div class="mt-4 text-sm">
					<span class="font-medium text-base-content/70">Clinician note and plan:</span>
					<p class="mt-1 text-base-content/80">{data.summary.reviewContext}</p>
				</div>
			{/if}
		</div>
	</main>
{/if}
