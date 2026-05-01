<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { validateEuGeneral } from '$lib/engine/eu-general-validator';
	import { detectFlaggedIssues } from '$lib/engine/flagged-issues';

	import Step1PatientRegistration from '$lib/components/steps/Step1PatientRegistration.svelte';
	import Step2ChiefComplaintAndVitals from '$lib/components/steps/Step2ChiefComplaintAndVitals.svelte';
	import Step3HighRiskSigns from '$lib/components/steps/Step3HighRiskSigns.svelte';
	import Step4Airway from '$lib/components/steps/Step4Airway.svelte';
	import Step5Breathing from '$lib/components/steps/Step5Breathing.svelte';
	import Step6Circulation from '$lib/components/steps/Step6Circulation.svelte';
	import Step7Disability from '$lib/components/steps/Step7Disability.svelte';
	import Step8HistoryOfPresentIllness from '$lib/components/steps/Step8HistoryOfPresentIllness.svelte';
	import Step9ReviewOfSystems from '$lib/components/steps/Step9ReviewOfSystems.svelte';
	import Step10PastMedicalHistory from '$lib/components/steps/Step10PastMedicalHistory.svelte';
	import Step11PhysicalExam from '$lib/components/steps/Step11PhysicalExam.svelte';
	import Step12Diagnostics from '$lib/components/steps/Step12Diagnostics.svelte';
	import Step13AdditionalInterventions from '$lib/components/steps/Step13AdditionalInterventions.svelte';
	import Step14AssessmentAndPlan from '$lib/components/steps/Step14AssessmentAndPlan.svelte';
	import Step15Reassessment from '$lib/components/steps/Step15Reassessment.svelte';
	import Step16Disposition from '$lib/components/steps/Step16Disposition.svelte';

	let submitted = $state(false);

	function submitForm() {
		assessment.validation = validateEuGeneral(assessment.data);
		assessment.flags = detectFlaggedIssues(assessment.data);
		submitted = true;
		if (typeof window !== 'undefined') {
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	}

	function startOver() {
		assessment.reset();
		submitted = false;
	}
</script>

<svelte:head>
	<title>WHO Emergency Unit Form: General</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<header class="border-b border-gray-200 bg-white shadow-sm no-print">
		<div class="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
			<h1 class="text-lg font-bold text-gray-900">
				WHO Emergency Unit Form: General
			</h1>
			<button
				type="button"
				onclick={startOver}
				class="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
			>
				Start over
			</button>
		</div>
	</header>

	<main class="mx-auto max-w-3xl px-4 py-6">
		<div class="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
			This single-page form documents a non-trauma emergency unit encounter from
			arrival through disposition: registration, vitals, ABCD primary survey, history,
			review of systems, past medical history, physical exam, diagnostics, interventions,
			assessment and plan, reassessment, and final disposition. Submit when complete to see
			a completeness summary and any flagged clinical issues.
		</div>

		{#if submitted && assessment.validation}
			<div class="mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
				<h2 class="mb-3 text-xl font-bold text-gray-900">Submission summary</h2>
				<p class="mb-3 text-sm text-gray-700">
					{assessment.validation.totalSatisfied} of
					{assessment.validation.totalRequired} required fields completed.
				</p>
				{#if assessment.validation.complete}
					<p class="rounded-md bg-green-100 px-3 py-2 text-sm font-medium text-green-900">
						The encounter record is complete.
					</p>
				{:else}
					<div class="rounded-md bg-amber-100 px-3 py-2 text-sm text-amber-900">
						<p class="mb-2 font-medium">
							The encounter record is incomplete. Please review the missing items below:
						</p>
						<ul class="ml-5 list-disc space-y-1">
							{#each assessment.validation.missing as miss (miss.id)}
								<li><strong>{miss.id}</strong> — {miss.description}</li>
							{/each}
						</ul>
					</div>
				{/if}

				{#if assessment.flags.length > 0}
					<h3 class="mt-5 mb-2 text-base font-semibold text-gray-900">
						Flagged issues for clinician review
					</h3>
					<ul class="space-y-2">
						{#each assessment.flags as flag (flag.id)}
							<li class="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm">
								<span class="font-semibold text-gray-800">[{flag.priority}]</span>
								<span class="ml-1 text-gray-700">{flag.category}:</span>
								<span class="ml-1 text-gray-700">{flag.message}</span>
							</li>
						{/each}
					</ul>
				{/if}
			</div>
		{/if}

		<div class="space-y-8">
			<Step1PatientRegistration />
			<Step2ChiefComplaintAndVitals />
			<Step3HighRiskSigns />
			<Step4Airway />
			<Step5Breathing />
			<Step6Circulation />
			<Step7Disability />
			<Step8HistoryOfPresentIllness />
			<Step9ReviewOfSystems />
			<Step10PastMedicalHistory />
			<Step11PhysicalExam />
			<Step12Diagnostics />
			<Step13AdditionalInterventions />
			<Step14AssessmentAndPlan />
			<Step15Reassessment />
			<Step16Disposition />
		</div>

		<div class="mt-10 flex justify-end">
			<button
				type="button"
				onclick={submitForm}
				class="rounded-lg bg-primary px-8 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-dark"
			>
				Submit Form
			</button>
		</div>
	</main>
</div>
