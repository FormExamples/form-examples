<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import {
		statusLabel,
		statusColor,
		priorityLabel,
		priorityColor,
		careSettingLabel,
		clinicianRoleLabel,
		sexLabel,
		ageBandLabel,
		tbsaMethodLabel,
		mechanismLabel,
		formatVolume,
		formatRate,
		formatHours
	} from '#lib/engine/utils.js';
	import Button from '#lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/parkland-formula-for-burns/parkland-formula-for-burns-calculations/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/parkland-formula-for-burns-calculations/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `parkland-${data.identification.patientIdentifier || id}.pdf`;
				a.click();
				URL.revokeObjectURL(url);
			} else {
				pdfError = 'Failed to generate PDF. Please try again.';
			}
		} catch {
			pdfError = 'Failed to generate PDF. Please check your connection and try again.';
		}
	}

	const isOverdue = $derived(!!result && result.status === 'overdue');
</script>

{#if result}
	<header class="border-b border-base-300 bg-base-100 shadow-sm no-print">
		<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
			<h1 class="text-lg font-bold text-base-content">Parkland resuscitation report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button
					data-variant="secondary"
					onclick={() => goto(`/parkland-formula-for-burns/parkland-formula-for-burns-calculations/${id}`)}>Edit</Button
				>
			</div>
		</div>
	</header>

	<main class="mx-16 px-4 py-6">
		<!-- Result banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {statusColor(result.status)}">
			<div class="text-3xl font-bold">{formatVolume(result.total24hVolumeMl)}</div>
			<div class="mt-1 text-sm font-semibold">total crystalloid over 24 h</div>
			<div class="mt-2 text-sm font-semibold">{statusLabel(result.status)}</div>
			<div class="mt-2 text-sm opacity-75">
				Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- Recommended action -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-2 text-lg font-bold text-base-content">Recommended action</h2>
			{#if result.status === 'incomplete'}
				<p class="text-sm text-base-content/80">
					Body weight and %TBSA are both required to compute the resuscitation volume. Record the
					missing input and re-calculate.
				</p>
			{:else if isOverdue}
				<p class="text-sm text-base-content/80">
					The first-8-h window from injury has <strong>elapsed</strong>. Give the outstanding
					first-phase volume now as a priority, then re-plan the remainder against the 24 h total,
					and continue titrating to urine output.
				</p>
			{:else}
				<p class="text-sm text-base-content/80">
					Commence crystalloid at the first-phase rate below and <strong
						>titrate to a urine output of 0.5-1.0 mL/kg/h</strong
					>. The Parkland volume is a starting estimate only and does not replace specialist burns
					advice.
				</p>
			{/if}
		</div>

		<!-- Resuscitation plan -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Resuscitation plan</h2>
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-base-300 text-left text-base-content/70">
						<th class="pb-2 pr-4">Derived output</th>
						<th class="pb-2">Value</th>
					</tr>
				</thead>
				<tbody>
					<tr class="border-b border-base-200 font-semibold">
						<td class="py-2 pr-4">Total 24 h volume (4 × weight × %TBSA)</td>
						<td class="py-2">{formatVolume(result.total24hVolumeMl)}</td>
					</tr>
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4">First 8 h volume (half)</td>
						<td class="py-2">{formatVolume(result.first8hVolumeMl)}</td>
					</tr>
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4">Next 16 h volume (half)</td>
						<td class="py-2">{formatVolume(result.next16hVolumeMl)}</td>
					</tr>
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4">Hours since injury</td>
						<td class="py-2">{formatHours(result.hoursSinceInjury)}</td>
					</tr>
					<tr class="border-b border-base-200 font-semibold">
						<td class="py-2 pr-4">First-phase rate (remaining window)</td>
						<td class="py-2">
							{#if result.total24hVolumeMl !== null && result.first8hRateMlPerHour === null}
								Overdue — give outstanding volume now
							{:else}
								{formatRate(result.first8hRateMlPerHour)}
							{/if}
						</td>
					</tr>
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4">Second-phase rate (over 16 h)</td>
						<td class="py-2">{formatRate(result.next16hRateMlPerHour)}</td>
					</tr>
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4">Urine-output target (0.5-1.0 mL/kg/h)</td>
						<td class="py-2">
							{#if result.targetUrineOutputLowMlPerHour === null}
								—
							{:else}
								{formatRate(result.targetUrineOutputLowMlPerHour)} - {formatRate(
									result.targetUrineOutputHighMlPerHour
								)}
							{/if}
						</td>
					</tr>
				</tbody>
			</table>
			<p class="mt-3 text-xs text-base-content/60">
				total24hVolumeMl = 4 × weightKg × tbsaPercent; each phase = half; first-phase rate =
				first8hVolume ÷ remaining first-8-h hours from injury.
			</p>
		</div>

		<!-- Flagged issues -->
		{#if result.flaggedIssues.length > 0}
			<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-error">
					Flagged issues ({result.flaggedIssues.length})
				</h2>
				<div class="space-y-2">
					{#each result.flaggedIssues as flag (flag.id)}
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

		<!-- Inputs / context summary -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Assessment summary</h2>
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
					{careSettingLabel(data.context.careSetting) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Body weight:</span>
					{data.weight.weightKg === null ? 'Not recorded' : `${data.weight.weightKg} kg`}
				</div>
				<div>
					<span class="font-medium text-base-content/70">%TBSA:</span>
					{data.burn.tbsaPercent === null ? 'Not recorded' : `${data.burn.tbsaPercent}%`}
					{#if tbsaMethodLabel(data.burn.tbsaMethod)}
						({tbsaMethodLabel(data.burn.tbsaMethod)})
					{/if}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Time of injury:</span>
					{data.injury.injuryAt || 'Not recorded'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Mechanism:</span>
					{mechanismLabel(data.features.mechanism) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Clinician:</span>
					{data.context.clinicianName || 'N/A'}
					{#if clinicianRoleLabel(data.context.clinicianRole)}
						({clinicianRoleLabel(data.context.clinicianRole)})
					{/if}
				</div>
			</div>
			{#if data.note.clinicalNote}
				<div class="mt-4 text-sm">
					<span class="font-medium text-base-content/70">Clinical note:</span>
					<p class="mt-1 text-base-content/80">{data.note.clinicalNote}</p>
				</div>
			{/if}
		</div>
	</main>
{/if}
