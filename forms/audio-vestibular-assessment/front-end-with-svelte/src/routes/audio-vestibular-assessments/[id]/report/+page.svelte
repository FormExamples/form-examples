<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import {
		calculateAge,
		hearingLossGradeLabel,
		hearingLossGradeColor,
		dhiHandicapLabel,
		dhiHandicapColor,
		priorityColor
	} from '$lib/engine/utils';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/audio-vestibular-assessments/${id}`);
		}
	});

	let pdfError = $state('');

	async function downloadPDF() {
		pdfError = '';
		try {
			const res = await fetch(`/audio-vestibular-assessments/${id}/report/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data: assessment.data, result: assessment.result })
			});
			if (res.ok) {
				const blob = await res.blob();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `audio-vestibular-assessment-${data.demographics.lastName || id}.pdf`;
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
			<h1 class="text-lg font-bold text-base-content">Audio-vestibular assessment report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/audio-vestibular-assessments/${id}`)}>Edit</Button>
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-4xl px-4 py-6">
		<!-- Headline results -->
		<div class="mb-6 grid gap-4 sm:grid-cols-2">
			<div class="rounded-xl border-2 p-6 text-center {hearingLossGradeColor(result.hearingLossGrade)}">
				<div class="text-sm font-semibold uppercase tracking-wide opacity-80">Better-ear PTA</div>
				<div class="mt-1 text-3xl font-bold">
					{result.betterEarPta == null ? '—' : `${result.betterEarPta} dB`}
				</div>
				<div class="mt-1 text-sm opacity-80">
					{result.asymmetry == null ? 'Asymmetry: —' : `Asymmetry: ${result.asymmetry} dB`}
				</div>
				<div class="mt-3">
					<Badge label={hearingLossGradeLabel(result.hearingLossGrade)} colorClass="bg-base-100 text-base-content border-base-100" />
				</div>
			</div>
			<div class="rounded-xl border-2 p-6 text-center {dhiHandicapColor(result.dhiHandicapLevel)}">
				<div class="text-sm font-semibold uppercase tracking-wide opacity-80">DHI total</div>
				<div class="mt-1 text-3xl font-bold">{result.dhiTotal} / 100</div>
				<div class="mt-1 text-sm opacity-80">
					Based on {result.dhiAnsweredCount} of 25 items answered
				</div>
				<div class="mt-3">
					<Badge label={dhiHandicapLabel(result.dhiHandicapLevel)} colorClass="bg-base-100 text-base-content border-base-100" />
				</div>
			</div>
		</div>
		<div class="mb-6 text-center text-sm text-base-content/60">
			Generated {new Date(result.timestamp).toLocaleString()}
		</div>

		<!-- Flagged issues -->
		{#if result.additionalFlags.length > 0}
			<div class="mb-6 rounded-xl border border-error/40 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-error">Flagged issues</h2>
				<div class="space-y-2">
					{#each result.additionalFlags as flag (flag.id)}
						<div class="flex items-start gap-3 rounded-lg border p-3 {priorityColor(flag.priority)}">
							<span class="mt-0.5 rounded px-2 py-0.5 text-xs font-bold uppercase {priorityColor(flag.priority)}">
								{flag.priority}
							</span>
							<div><span class="font-medium">{flag.category}:</span> {flag.message}</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Pure-tone audiometry -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Pure-tone audiometry</h2>
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-base-300 text-left text-base-content/70">
						<th class="pb-2 pr-4">Ear</th>
						<th class="pb-2 pr-4">PTA (dB HL)</th>
						<th class="pb-2">WHO grade</th>
					</tr>
				</thead>
				<tbody>
					<tr class="border-b border-base-200">
						<td class="py-2 pr-4 font-medium">Right</td>
						<td class="py-2 pr-4">{result.rightPta == null ? '—' : result.rightPta}</td>
						<td class="py-2">{hearingLossGradeLabel(result.rightHearingLossGrade)}</td>
					</tr>
					<tr>
						<td class="py-2 pr-4 font-medium">Left</td>
						<td class="py-2 pr-4">{result.leftPta == null ? '—' : result.leftPta}</td>
						<td class="py-2">{hearingLossGradeLabel(result.leftHearingLossGrade)}</td>
					</tr>
				</tbody>
			</table>
		</div>

		<!-- DHI subscales -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">DHI subscales</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-3">
				<div>
					<div class="text-base-content/70">Functional (max 36)</div>
					<div class="text-2xl font-bold text-base-content">{result.dhiFunctional}</div>
				</div>
				<div>
					<div class="text-base-content/70">Emotional (max 36)</div>
					<div class="text-2xl font-bold text-base-content">{result.dhiEmotional}</div>
				</div>
				<div>
					<div class="text-base-content/70">Physical (max 28)</div>
					<div class="text-2xl font-bold text-base-content">{result.dhiPhysical}</div>
				</div>
			</div>
		</div>

		<!-- Patient summary -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Patient summary</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div><span class="font-medium text-base-content/70">Name:</span> {data.demographics.firstName} {data.demographics.lastName}</div>
				<div>
					<span class="font-medium text-base-content/70">DOB:</span> {data.demographics.dateOfBirth}
					{#if calculateAge(data.demographics.dateOfBirth)}(Age {calculateAge(data.demographics.dateOfBirth)}){/if}
				</div>
				<div><span class="font-medium text-base-content/70">Sex:</span> {data.demographics.sex || 'N/A'}</div>
				<div><span class="font-medium text-base-content/70">Assessed:</span> {data.demographics.assessmentDate || 'N/A'}</div>
			</div>
		</div>

		<!-- Clinical impression -->
		{#if data.clinicalImpressionReferral.provisionalDiagnosis}
			<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
				<h2 class="mb-4 text-lg font-bold text-base-content">Clinical impression</h2>
				<p class="text-sm text-base-content/80">{data.clinicalImpressionReferral.provisionalDiagnosis}</p>
			</div>
		{/if}
	</main>
{/if}
