<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import {
		goldGradeLabel,
		goldGradeColor,
		abeGroupLabel,
		abeGroupColor,
		reviewStatusLabel,
		reviewStatusColor,
		axisLabel,
		axisColor,
		priorityLabel,
		priorityColor,
		clinicianRoleLabel,
		reviewTypeLabel,
		sexLabel,
		ageBandLabel
	} from '$lib/engine/utils';
	import Button from '$lib/components/ui/Button.svelte';

	const plural = 'chronic-obstructive-pulmonary-disease-reviews';

	const id = $derived(page.params.id ?? 'new');
	const data = $derived(assessment.data);
	const result = $derived(assessment.result);

	$effect(() => {
		if (!assessment.result) {
			goto(`/${plural}/${id}`);
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
				a.download = `copd-review-${data.context.patientIdentifier || id}.pdf`;
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
			<h1 class="text-lg font-bold text-base-content">COPD review report</h1>
			<div class="flex items-center gap-3">
				{#if pdfError}
					<span class="text-sm text-error">{pdfError}</span>
				{/if}
				<Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
				<Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
				<Button data-variant="secondary" onclick={() => goto(`/${plural}/${id}`)}>Edit</Button>
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-4xl px-4 py-6">
		<!-- GOLD + ABE banner -->
		<div class="mb-6 grid gap-4 sm:grid-cols-2">
			<div class="rounded-xl border-2 p-6 text-center {goldGradeColor(result.goldGrade)}">
				<div class="text-2xl font-bold">{goldGradeLabel(result.goldGrade)}</div>
				<div class="mt-2 text-sm font-semibold">Airflow-limitation grade</div>
			</div>
			<div class="rounded-xl border-2 p-6 text-center {abeGroupColor(result.abeGroup)}">
				<div class="text-2xl font-bold">{abeGroupLabel(result.abeGroup)}</div>
				<div class="mt-2 text-sm font-semibold">Combined ABE assessment group</div>
			</div>
		</div>

		<!-- Axes + completeness -->
		<div class="mb-6 grid gap-4 sm:grid-cols-3">
			<div class="rounded-xl border-2 p-4 text-center {axisColor(result.symptomBurden)}">
				<div class="text-xl font-bold">{axisLabel(result.symptomBurden)}</div>
				<div class="mt-1 text-xs font-semibold">Symptom burden</div>
			</div>
			<div class="rounded-xl border-2 p-4 text-center {axisColor(result.exacerbationRisk)}">
				<div class="text-xl font-bold">{axisLabel(result.exacerbationRisk)}</div>
				<div class="mt-1 text-xs font-semibold">Exacerbation risk</div>
			</div>
			<div class="rounded-xl border-2 p-4 text-center {reviewStatusColor(result.reviewStatus)}">
				<div class="text-xl font-bold">{reviewStatusLabel(result.reviewStatus)}</div>
				<div class="mt-1 text-xs font-semibold">Review completeness</div>
			</div>
		</div>

		<div class="mb-6 text-center text-sm text-base-content/60">
			Generated {new Date(result.timestamp).toLocaleString()}
		</div>

		<!-- Interpretation -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-2 text-lg font-bold text-base-content">Interpretation</h2>
			<p class="text-sm text-base-content/80">
				{#if result.goldGrade === null}
					FEV₁ % predicted was not recorded, so a GOLD airflow grade could not be assigned.
				{:else}
					The post-bronchodilator FEV₁ % predicted places this patient at
					<strong>{goldGradeLabel(result.goldGrade)}</strong>.
				{/if}
				{#if result.abeGroup === null}
					No symptom or exacerbation data was recorded, so an ABE group could not be assigned.
				{:else}
					The combined symptom burden and exacerbation risk place this patient in
					<strong>{abeGroupLabel(result.abeGroup)}</strong>.
				{/if}
				The review is <strong>{reviewStatusLabel(result.reviewStatus)}</strong>. This is not a
				diagnosis and does not replace clinical judgement.
			</p>
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

		<!-- Patient / context summary -->
		<div class="mb-6 rounded-xl border border-base-300 bg-base-100 p-6">
			<h2 class="mb-4 text-lg font-bold text-base-content">Review summary</h2>
			<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
				<div>
					<span class="font-medium text-base-content/70">Patient ID:</span>
					{data.context.patientIdentifier || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Age band:</span>
					{ageBandLabel(data.context.ageBand) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Sex:</span>
					{sexLabel(data.context.sex) || 'N/A'}
				</div>
				<div>
					<span class="font-medium text-base-content/70">Review type:</span>
					{reviewTypeLabel(data.context.reviewType) || 'N/A'}
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
			{#if data.note.clinicianNote}
				<div class="mt-4 text-sm">
					<span class="font-medium text-base-content/70">Clinician note:</span>
					<p class="mt-1 text-base-content/80">{data.note.clinicianNote}</p>
				</div>
			{/if}
		</div>
	</main>
{/if}
