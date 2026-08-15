<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import {
		statusLabel,
		statusColor,
		priorityLabel,
		priorityColor,
		satisfiedColor,
		clinicianRoleLabel,
		careSettingLabel,
		admissionSourceLabel,
		sexLabel,
		ageBandLabel,
		allergyStatusLabel
	} from '#lib/engine/utils.js';
	import Button from '#lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/history-and-physical-examination/history-and-physical-examinations/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/history-and-physical-examinations/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `history-and-physical-${data.identification.patientIdentifier || id}.pdf`;
				a.click();
				URL.revokeObjectURL(url);
			} else {
				pdfError = 'Failed to generate PDF. Please try again.';
			}
		} catch {
			pdfError = 'Failed to generate PDF. Please check your connection and try again.';
		}
	}

	const satisfiedCount = $derived(
		result ? result.componentStatuses.filter((c) => c.satisfied).length : 0
	);
</script>

{#if result}
	<header class="border-b border-base-300 bg-base-100 shadow-sm no-print">
		<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
			<h1 class="text-lg font-bold text-base-content">H and P report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button
					data-variant="secondary"
					onclick={() => goto(`/history-and-physical-examination/history-and-physical-examinations/${id}`)}>Edit</Button
				>
			</div>
		</div>
	</header>

	<main class="mx-16 px-4 py-6">
		<!-- Completeness banner -->
		<div class="mb-6 grid gap-4 sm:grid-cols-2">
			<div class="rounded-xl border-2 p-6 text-center {statusColor(result.status)}">
				<div class="text-3xl font-bold">{statusLabel(result.status)}</div>
				<div class="mt-2 text-sm font-semibold">
					{satisfiedCount} of {result.componentStatuses.length} required components documented ({result.completenessPercent}%)
				</div>
			</div>
			<div
				class="rounded-xl border-2 p-6 text-center {result.blocking
					? 'bg-error text-error-content border-error'
					: 'bg-base-300 text-base-content border-base-300'}"
			>
				<div class="text-3xl font-bold">
					{result.blocking ? 'Blocking flag' : 'No blocking flag'}
				</div>
				<div class="mt-2 text-sm font-semibold">
					{result.flags.length
						? `${result.flags.length} safety ${result.flags.length === 1 ? 'flag' : 'flags'} raised`
						: 'No safety flags raised'}
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
					All ten required components are documented and no blocking flag was raised — the clerking
					record is <strong>complete</strong>.
				{:else if result.status === 'partial'}
					{result.componentStatuses.length - satisfiedCount} of {result.componentStatuses.length} required
					components are outstanding — the clerking record is <strong>partial</strong>. Complete the
					outstanding components to finish the document.
				{:else}
					The clerking record is <strong>incomplete</strong>.
					{#if result.blocking}
						A blocking safety flag (allergies not documented, or no impression and no plan) forced
						this status; resolve it before completing the clerking.
					{:else}
						The core clinical narrative (presenting complaint, its history, the core examination, and
						an impression or plan) is not yet complete.
					{/if}
				{/if}
			</p>
		</div>

		<!-- Component documentation -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Required-component documentation</h2>
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-base-300 text-left text-base-content/70">
						<th class="pb-2 pr-4">Component</th>
						<th class="pb-2">Documented</th>
					</tr>
				</thead>
				<tbody>
					{#each result.componentStatuses as c (c.component)}
						<tr class="border-b border-base-200">
							<td class="py-2 pr-4">{c.label}</td>
							<td class="py-2">
								<span
									class="rounded-full border px-2 py-0.5 text-xs font-bold {satisfiedColor(
										c.satisfied
									)}">{c.satisfied ? 'Documented' : 'Outstanding'}</span
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
								{priorityLabel(flag.priority)}{flag.blocking ? ' · BLOCKING' : ''}
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

		<!-- Patient / encounter summary -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Clerking summary</h2>
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
					<span class="font-medium text-base-content/70">Care setting:</span>
					{careSettingLabel(data.encounter.careSetting) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Admission source:</span>
					{admissionSourceLabel(data.encounter.admissionSource) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Allergy status:</span>
					{allergyStatusLabel(data.history.allergyStatus) || 'Not documented'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Clinician:</span>
					{data.encounter.clinicianName || 'N/A'}
					{#if clinicianRoleLabel(data.encounter.clinicianRole)}
						({clinicianRoleLabel(data.encounter.clinicianRole)})
					{/if}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Clerked at:</span>
					{data.encounter.clerkedAt || 'N/A'}
				</div>
			</div>
			{#if data.assessment.impression}
				<div class="mt-4 text-sm">
					<span class="font-medium text-base-content/70">Impression / problem list:</span>
					<p class="mt-1 text-base-content/80">{data.assessment.impression}</p>
				</div>
			{/if}
			{#if data.assessment.managementPlan}
				<div class="mt-4 text-sm">
					<span class="font-medium text-base-content/70">Management plan:</span>
					<p class="mt-1 text-base-content/80">{data.assessment.managementPlan}</p>
				</div>
			{/if}
		</div>
	</main>
{/if}
