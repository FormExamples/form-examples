<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { validateCfar } from '$lib/engine/cfar-validator';
	import { detectFlaggedIssues } from '$lib/engine/flagged-issues';

	import Step1PatientIdentification from '$lib/components/steps/Step1PatientIdentification.svelte';
	import Step2ReferralTransport from '$lib/components/steps/Step2ReferralTransport.svelte';
	import Step3Situation from '$lib/components/steps/Step3Situation.svelte';
	import Step4Background from '$lib/components/steps/Step4Background.svelte';
	import Step5MajorBleeding from '$lib/components/steps/Step5MajorBleeding.svelte';
	import Step6Airway from '$lib/components/steps/Step6Airway.svelte';
	import Step7Breathing from '$lib/components/steps/Step7Breathing.svelte';
	import Step8Circulation from '$lib/components/steps/Step8Circulation.svelte';
	import Step9Disability from '$lib/components/steps/Step9Disability.svelte';
	import Step10Exposure from '$lib/components/steps/Step10Exposure.svelte';
	import Step11Recommendations from '$lib/components/steps/Step11Recommendations.svelte';
	import Step12ResponderDetails from '$lib/components/steps/Step12ResponderDetails.svelte';

	let submitted = $state(false);

	function submitForm() {
		assessment.validation = validateCfar(assessment.data);
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
	<title>WHO Emergency First Aid Form — patient questionnaire</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<header class="border-b border-gray-200 bg-white shadow-sm no-print">
		<div class="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
			<h1 class="text-lg font-bold text-gray-900">
				WHO Emergency First Aid Form
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
			This single-page form documents an emergency first aid encounter using the
			CABCDE framework (Catastrophic bleeding, Airway, Breathing, Circulation,
			Disability, Exposure). All sections are presented on one page and completed
			by a Community First Aid Responder. Submit the form to see a completeness
			summary and a list of flagged clinical issues for handover.
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
						Form is complete. Send a copy of this form with the patient to the referral
						facility.
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
			<Step1PatientIdentification />
			<Step2ReferralTransport />
			<Step3Situation />
			<Step4Background />
			<Step5MajorBleeding />
			<Step6Airway />
			<Step7Breathing />
			<Step8Circulation />
			<Step9Disability />
			<Step10Exposure />
			<Step11Recommendations />
			<Step12ResponderDetails />
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
