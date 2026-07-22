<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import {
		readinessBandLabel,
		readinessBandColor,
		priorityLabel,
		priorityColor,
		scoreColor,
		anaestheticTechniqueLabel,
		nurseRoleLabel,
		sexLabel,
		ageBandLabel,
		asaStatusLabel
	} from '$lib/engine/utils';
	import { aldreteValueLabel } from '$lib/engine/pacu-rules';
	import Button from '$lib/components/ui/Button.svelte';

	const plural = 'post-anaesthesia-care-unit-records';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/post-anaesthesia-care-unit-record/${plural}/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/${plural}/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `pacu-record-${data.identification.patientIdentifier || id}.pdf`;
				a.click();
				URL.revokeObjectURL(url);
			} else {
				pdfError = 'Failed to generate PDF. Please try again.';
			}
		} catch {
			pdfError = 'Failed to generate PDF. Please check your connection and try again.';
		}
	}

	const aldreteRows = $derived(
		result
			? ([
					['activity', 'Activity', data.activity.activity, result.activityScore],
					['respiration', 'Respiration', data.respiration.respiration, result.respirationScore],
					['circulation', 'Circulation', data.circulation.circulation, result.circulationScore],
					[
						'consciousness',
						'Consciousness',
						data.consciousness.consciousness,
						result.consciousnessScore
					],
					[
						'oxygenSaturation',
						'Oxygen saturation',
						data.oxygenSaturation.oxygenSaturation,
						result.oxygenSaturationScore
					]
				] as const)
			: []
	);
</script>

{#if result}
	<header class="border-b border-base-300 bg-base-100 shadow-sm no-print">
		<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
			<h1 class="text-lg font-bold text-base-content">PACU recovery record report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/post-anaesthesia-care-unit-record/${plural}/${id}`)}>Edit</Button>
			</div>
		</div>
	</header>

	<main class="mx-16 px-4 py-6">
		<!-- Score banner -->
		<div class="mb-6 rounded-xl border-2 p-6 text-center {readinessBandColor(result.readinessBand)}">
			<div class="text-3xl font-bold">Modified Aldrete {result.aldreteTotal} of 10</div>
			<div class="mt-2 text-sm font-semibold">{readinessBandLabel(result.readinessBand)}</div>
			{#if result.padssTotal !== null}
				<div class="mt-1 text-sm font-semibold">
					PADSS {result.padssTotal} of 10 — {result.padssStreetFit
						? 'street-fit'
						: 'not yet street-fit'}
				</div>
			{/if}
			<div class="mt-2 text-sm opacity-75">
				Generated {new Date(result.timestamp).toLocaleString()}
			</div>
		</div>

		<!-- Recommended action -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-2 text-lg font-bold text-base-content">Recommended action</h2>
			{#if result.readinessBand === 'discharge-ready'}
				<p class="text-sm text-base-content/80">
					Documented PACU discharge criteria are <strong>met</strong> (Aldrete &ge; 9 with the
					oxygen-saturation parameter satisfied). This is not a discharge order — the supervising
					anaesthetist retains responsibility for the discharge decision.
				</p>
			{:else}
				<p class="text-sm text-base-content/80">
					Documented PACU discharge criteria are <strong>not met</strong>. Continue recovery
					observation and active management; address the parameter(s) scoring below 2 before
					discharge from PACU.
				</p>
			{/if}
		</div>

		<!-- Aldrete parameters -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Modified Aldrete parameters</h2>
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-base-300 text-left text-base-content/70">
						<th class="pb-2 pr-4">Parameter</th>
						<th class="pb-2 pr-4">Recorded</th>
						<th class="pb-2">Score</th>
					</tr>
				</thead>
				<tbody>
					{#each aldreteRows as [key, label, value, score] (key)}
						<tr class="border-b border-base-200">
							<td class="py-2 pr-4">{label}</td>
							<td class="py-2 pr-4">{aldreteValueLabel(key, value)}</td>
							<td class="py-2">
								<span
									class="rounded-full border px-2 py-0.5 text-xs font-bold {scoreColor(score)}"
									>{score}</span
								>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
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

		<!-- Patient / context summary -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Record summary</h2>
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
					<span class="font-medium text-base-content/70">ASA status:</span>
					{asaStatusLabel(data.identification.asaStatus) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Technique:</span>
					{anaestheticTechniqueLabel(data.context.anaestheticTechnique) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Procedure:</span>
					{data.context.procedure || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Recording nurse:</span>
					{data.context.nurseName || 'N/A'}
					{#if nurseRoleLabel(data.context.nurseRole)}
						({nurseRoleLabel(data.context.nurseRole)})
					{/if}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Anaesthetist:</span>
					{data.context.anaesthetistName || 'N/A'}
				</div>
			</div>
			{#if data.note.recoveryNote}
				<div class="mt-4 text-sm">
					<span class="font-medium text-base-content/70">Recovery note:</span>
					<p class="mt-1 text-base-content/80">{data.note.recoveryNote}</p>
				</div>
			{/if}
		</div>
	</main>
{/if}
