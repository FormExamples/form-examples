<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import {
		statusLabel,
		statusColor,
		priorityLabel,
		priorityColor,
		completedColor,
		healthActionPlanColor,
		clinicianRoleLabel,
		sexLabel,
		ageBandLabel,
		ldRegisterStatusLabel
	} from '$lib/engine/utils';
	import Button from '$lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/learning-disability-annual-health-check/learning-disability-annual-health-checks/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/learning-disability-annual-health-checks/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `ld-annual-health-check-${data.identification.personIdentifier || id}.pdf`;
				a.click();
				URL.revokeObjectURL(url);
			} else {
				pdfError = 'Failed to generate PDF. Please try again.';
			}
		} catch {
			pdfError = 'Failed to generate PDF. Please check your connection and try again.';
		}
	}

	const completedCount = $derived(
		result ? result.componentStatuses.filter((c) => c.completed).length : 0
	);
</script>

{#if result}
	<header class="border-b border-base-300 bg-base-100 shadow-sm no-print">
		<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
			<h1 class="text-lg font-bold text-base-content">Annual health check report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button
					data-variant="secondary"
					onclick={() => goto(`/learning-disability-annual-health-check/learning-disability-annual-health-checks/${id}`)}>Edit</Button
				>
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-4xl px-4 py-6">
		<!-- Completeness + Health Action Plan banner -->
		<div class="mb-6 grid gap-4 sm:grid-cols-2">
			<div class="rounded-xl border-2 p-6 text-center {statusColor(result.status)}">
				<div class="text-3xl font-bold">{statusLabel(result.status)}</div>
				<div class="mt-2 text-sm font-semibold">
					{completedCount} of {result.componentStatuses.length} required components completed ({result.completenessPercent}%)
				</div>
			</div>
			<div
				class="rounded-xl border-2 p-6 text-center {healthActionPlanColor(
					result.healthActionPlanComplete
				)}"
			>
				<div class="text-3xl font-bold">Health Action Plan</div>
				<div class="mt-2 text-sm font-semibold">
					{result.healthActionPlanComplete
						? 'Produced and shared with the person'
						: 'Not yet produced and shared'}
				</div>
			</div>
		</div>

		<div class="mb-6 text-center text-sm text-base-content/60">
			Generated {new Date(result.timestamp).toLocaleString()}
		</div>

		<!-- Interpretation -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-2 text-lg font-bold text-base-content">Interpretation</h2>
			<p class="text-sm text-base-content/80">
				{#if result.status === 'complete'}
					Every required component was carried out and a Health Action Plan was produced and shared —
					the annual health check is <strong>complete</strong>. Review the flags below and act on any
					that remain.
				{:else}
					The annual health check is <strong>incomplete</strong>. Complete the components marked
					<em>Missing</em> below{result.healthActionPlanComplete
						? ''
						: ', and produce and share the Health Action Plan'}, then re-check. This is a
					documentation aid, not a diagnosis.
				{/if}
			</p>
		</div>

		<!-- Required components -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Required components</h2>
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-base-300 text-left text-base-content/70">
						<th class="pb-2 pr-4">Component</th>
						<th class="pb-2">Status</th>
					</tr>
				</thead>
				<tbody>
					{#each result.componentStatuses as c (c.id)}
						<tr class="border-b border-base-200">
							<td class="py-2 pr-4">{c.label}</td>
							<td class="py-2">
								<span
									class="rounded-full border px-2 py-0.5 text-xs font-bold {completedColor(
										c.completed
									)}">{c.completed ? 'Completed' : 'Missing'}</span
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
				<h2 class="mb-4 text-lg font-bold text-error">
					Flagged issues ({result.flags.length})
				</h2>
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

		<!-- Person / context summary -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Check summary</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div>
					<span class="font-medium text-base-content/70">Person ID:</span>
					{data.identification.personIdentifier || 'N/A'}
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
					<span class="font-medium text-base-content/70">LD register:</span>
					{ldRegisterStatusLabel(data.identification.ldRegisterStatus) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Clinician:</span>
					{data.context.clinicianName || 'N/A'}
					{#if clinicianRoleLabel(data.context.clinicianRole)}
						({clinicianRoleLabel(data.context.clinicianRole)})
					{/if}
				</div>
				<div>
					<span class="font-medium text-base-content/70">GP practice:</span>
					{data.context.practiceName || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Date of check:</span>
					{data.context.checkedOn || 'N/A'}
				</div>
			</div>
			{#if data.plan.healthActionPlanActions}
				<div class="mt-4 text-sm">
					<span class="font-medium text-base-content/70">Health Action Plan actions:</span>
					<p class="mt-1 text-base-content/80">{data.plan.healthActionPlanActions}</p>
				</div>
			{/if}
			{#if data.plan.clinicianNote}
				<div class="mt-4 text-sm">
					<span class="font-medium text-base-content/70">Clinician note:</span>
					<p class="mt-1 text-base-content/80">{data.plan.clinicianNote}</p>
				</div>
			{/if}
		</div>
	</main>
{/if}
