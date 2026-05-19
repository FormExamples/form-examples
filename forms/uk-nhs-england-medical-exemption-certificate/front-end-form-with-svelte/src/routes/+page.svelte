<script lang="ts">
	import { application } from '$lib/stores/application.svelte';
	import { evaluateFp92a } from '$lib/engine/fp92a-validator';
	import { steps, TOTAL_STEPS } from '$lib/config/steps';

	import ProgressBar from '$lib/components/ProgressBar.svelte';
	import StepNavigation from '$lib/components/StepNavigation.svelte';

	import Step1Practitioner from '$lib/components/steps/Step1Practitioner.svelte';
	import Step2Patient from '$lib/components/steps/Step2Patient.svelte';
	import Step3ExistingExemption from '$lib/components/steps/Step3ExistingExemption.svelte';
	import Step4AgeCheck from '$lib/components/steps/Step4AgeCheck.svelte';
	import Step5PregnancyCheck from '$lib/components/steps/Step5PregnancyCheck.svelte';
	import Step6ConditionSelection from '$lib/components/steps/Step6ConditionSelection.svelte';
	import Step7ConditionDetail from '$lib/components/steps/Step7ConditionDetail.svelte';
	import Step8DisabilityAppliance from '$lib/components/steps/Step8DisabilityAppliance.svelte';
	import Step9Declaration from '$lib/components/steps/Step9Declaration.svelte';
	import Step10Summary from '$lib/components/steps/Step10Summary.svelte';

	const currentStep = $derived(application.currentStep);
	const isLast = $derived(currentStep === TOTAL_STEPS);
	const canGoBack = $derived(currentStep > 1);

	function nextStep() {
		if (application.currentStep < TOTAL_STEPS) {
			application.currentStep += 1;
			scrollToTop();
		}
	}

	function prevStep() {
		if (application.currentStep > 1) {
			application.currentStep -= 1;
			scrollToTop();
		}
	}

	function submitForm() {
		application.result = evaluateFp92a(application.data);
		if (typeof document !== 'undefined') {
			requestAnimationFrame(() => {
				document
					.getElementById('fp92a-result')
					?.scrollIntoView({ behavior: 'smooth' });
			});
		}
	}

	function startOver() {
		application.reset();
		scrollToTop();
	}

	function scrollToTop() {
		if (typeof window !== 'undefined') {
			requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
		}
	}
</script>

<div class="min-h-screen bg-gray-50">
	<header class="border-b border-gray-200 bg-white shadow-sm no-print">
		<div class="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
			<h1 class="text-lg font-bold text-gray-900">
				UK NHS England Medical Exemption Certificate (FP92A)
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
			This 10-step single-page wizard captures the data needed for an FP92A medical
			exemption application. NHSBSA Bridge House only accepts the original paper form posted
			in ink — this app is a digital staging tool to prepare and validate the data first.
		</div>

		<ProgressBar {currentStep} {steps} />

		<div class="mb-2 text-sm font-medium text-gray-600">
			{steps.find((s) => s.number === currentStep)?.title}
		</div>

		{#if currentStep === 1}
			<Step1Practitioner />
		{:else if currentStep === 2}
			<Step2Patient />
		{:else if currentStep === 3}
			<Step3ExistingExemption />
		{:else if currentStep === 4}
			<Step4AgeCheck />
		{:else if currentStep === 5}
			<Step5PregnancyCheck />
		{:else if currentStep === 6}
			<Step6ConditionSelection />
		{:else if currentStep === 7}
			<Step7ConditionDetail />
		{:else if currentStep === 8}
			<Step8DisabilityAppliance />
		{:else if currentStep === 9}
			<Step9Declaration />
		{:else if currentStep === 10}
			<div id="fp92a-result">
				<Step10Summary />
			</div>
		{/if}

		<div class="no-print">
			<StepNavigation
				{canGoBack}
				{isLast}
				onprev={prevStep}
				onnext={nextStep}
				onsubmit={submitForm}
			/>
		</div>
	</main>
</div>
