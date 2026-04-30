<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { validateB1 } from '$lib/engine/b1-validator';
	import { detectFlaggedIssues } from '$lib/engine/flagged-issues';

	import Step1PersonalDetails from '$lib/components/steps/Step1PersonalDetails.svelte';
	import Step2HealthcareProfessionals from '$lib/components/steps/Step2HealthcareProfessionals.svelte';
	import Step3ConditionHistory from '$lib/components/steps/Step3ConditionHistory.svelte';
	import Step4TreatmentProvider from '$lib/components/steps/Step4TreatmentProvider.svelte';
	import Step5Blackouts from '$lib/components/steps/Step5Blackouts.svelte';
	import Step6Seizures from '$lib/components/steps/Step6Seizures.svelte';
	import Step7Medication from '$lib/components/steps/Step7Medication.svelte';
	import Step8VpShunt from '$lib/components/steps/Step8VpShunt.svelte';
	import Step9DailyLiving from '$lib/components/steps/Step9DailyLiving.svelte';
	import Step10DoubleVision from '$lib/components/steps/Step10DoubleVision.svelte';
	import Step11Eyesight from '$lib/components/steps/Step11Eyesight.svelte';
	import Step12VehicleAdaptations from '$lib/components/steps/Step12VehicleAdaptations.svelte';
	import Step13Authorisation from '$lib/components/steps/Step13Authorisation.svelte';

	let submitted = $state(false);

	function submitForm() {
		assessment.validation = validateB1(assessment.data);
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
	<title>DVLA B1 — Confidential medical information (neurological)</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<header class="border-b border-gray-200 bg-white shadow-sm no-print">
		<div class="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
			<h1 class="text-lg font-bold text-gray-900">
				DVLA B1 — Confidential medical information (neurological)
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
			This single-page form collects the medical information the Driver and Vehicle
			Licensing Agency (DVLA) requires to assess your fitness to drive following a
			neurological condition. All sections are presented on one page; conditional
			questions appear only when they apply to your answers. When you have completed
			the form, submit it to see a completeness summary and a list of flagged issues.
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
						Form is complete. Please print and send to the DVLA Drivers Medical Group,
						Swansea, SA99 1DF, or email <code>eftd@dvla.gov.uk</code>.
					</p>
				{:else}
					<div class="rounded-md bg-amber-100 px-3 py-2 text-sm text-amber-900">
						<p class="mb-2 font-medium">
							The form is incomplete. Please review the missing items below:
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
			<Step1PersonalDetails />
			<Step2HealthcareProfessionals />
			<Step3ConditionHistory />
			<Step4TreatmentProvider />
			<Step5Blackouts />
			<Step6Seizures />
			<Step7Medication />
			<Step8VpShunt />
			<Step9DailyLiving />
			<Step10DoubleVision />
			<Step11Eyesight />
			<Step12VehicleAdaptations />
			<Step13Authorisation />
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
