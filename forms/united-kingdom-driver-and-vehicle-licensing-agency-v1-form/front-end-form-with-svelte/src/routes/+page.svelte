<script lang="ts">
	import { goto } from '$app/navigation';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { validateV1 } from '$lib/engine/v1-validator';
	import { detectFlaggedIssues } from '$lib/engine/flagged-issues';

	import Step1PersonalDetails from '$lib/components/steps/Step1PersonalDetails.svelte';
	import Step2HealthcareProfessionals from '$lib/components/steps/Step2HealthcareProfessionals.svelte';
	import Step3EyesightStandards from '$lib/components/steps/Step3EyesightStandards.svelte';
	import Step4VisionInBothEyes from '$lib/components/steps/Step4VisionInBothEyes.svelte';
	import Step5FieldOfVision from '$lib/components/steps/Step5FieldOfVision.svelte';
	import Step6Glaucoma from '$lib/components/steps/Step6Glaucoma.svelte';
	import Step7RetinitisPigmentosa from '$lib/components/steps/Step7RetinitisPigmentosa.svelte';
	import Step8LaserTreatment from '$lib/components/steps/Step8LaserTreatment.svelte';
	import Step9Blepharospasm from '$lib/components/steps/Step9Blepharospasm.svelte';
	import Step10NightBlindness from '$lib/components/steps/Step10NightBlindness.svelte';
	import Step11DoubleVision from '$lib/components/steps/Step11DoubleVision.svelte';
	import Step12OtherVisionConditions from '$lib/components/steps/Step12OtherVisionConditions.svelte';
	import Step13RecentContact from '$lib/components/steps/Step13RecentContact.svelte';
	import Step14Authorisation from '$lib/components/steps/Step14Authorisation.svelte';

	function submitForm() {
		const { firedValidations, isComplete, completionRatio } = validateV1(assessment.data);
		const flaggedIssues = detectFlaggedIssues(assessment.data);
		assessment.result = {
			isComplete,
			completionRatio,
			firedValidations,
			flaggedIssues,
			timestamp: new Date().toISOString()
		};
		goto('/report');
	}

	function startOver() {
		assessment.reset();
	}
</script>

<div class="min-h-screen bg-gray-50">
	<header class="border-b border-gray-200 bg-white shadow-sm no-print">
		<div class="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
			<h1 class="text-lg font-bold text-gray-900">
				DVLA V1 — Confidential Medical Information (Vision)
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
			This single-page declaration collects your personal details, the contact details of
			the healthcare professionals who care for your vision, and your answers to eleven
			vision questions. It supports the UK DVLA Snellen 6/12 driving standard. Most "No"
			answers skip the follow-up questions for that topic. Making a false declaration is a
			criminal offence.
		</div>

		<div class="space-y-8">
			<Step1PersonalDetails />
			<Step2HealthcareProfessionals />
			<Step3EyesightStandards />
			<Step4VisionInBothEyes />
			<Step5FieldOfVision />
			<Step6Glaucoma />
			<Step7RetinitisPigmentosa />
			<Step8LaserTreatment />
			<Step9Blepharospasm />
			<Step10NightBlindness />
			<Step11DoubleVision />
			<Step12OtherVisionConditions />
			<Step13RecentContact />
			<Step14Authorisation />
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
