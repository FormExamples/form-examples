<script lang="ts">
	import { goto } from '$app/navigation';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { gradeOOCG } from '$lib/engine/oocg-grader';
	import { TOTAL_STEPS } from '$lib/config/steps';
	import StepNavigation from '$lib/components/StepNavigationButtons.svelte';

	import Step1PatientDetails from '$lib/components/steps/Step1PatientDetails.svelte';
	import Step2EncounterDetails from '$lib/components/steps/Step2EncounterDetails.svelte';
	import Step3OperationalEfficiency from '$lib/components/steps/Step3OperationalEfficiency.svelte';
	import Step4ClinicalOutcome from '$lib/components/steps/Step4ClinicalOutcome.svelte';
	import Step5EQ5D5L from '$lib/components/steps/Step5EQ5D5L.svelte';
	import Step6GRC from '$lib/components/steps/Step6GRC.svelte';
	import Step7PROMIS from '$lib/components/steps/Step7PROMIS.svelte';
	import Step8FFT from '$lib/components/steps/Step8FFT.svelte';
	import Step9FollowupPlan from '$lib/components/steps/Step9FollowupPlan.svelte';
	import Step10SignOff from '$lib/components/steps/Step10SignOff.svelte';
	import Step11ReviewSubmit from '$lib/components/steps/Step11ReviewSubmit.svelte';

	const currentStep = $derived(assessment.currentStep);

	function goNext() {
		if (currentStep < TOTAL_STEPS) {
			assessment.currentStep = currentStep + 1;
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	}

	function goPrev() {
		if (currentStep > 1) {
			assessment.currentStep = currentStep - 1;
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	}

	function submitAssessment() {
		assessment.result = gradeOOCG(assessment.data);
		goto('/report');
	}
</script>

{#if currentStep === 1}
	<Step1PatientDetails />
{:else if currentStep === 2}
	<Step2EncounterDetails />
{:else if currentStep === 3}
	<Step3OperationalEfficiency />
{:else if currentStep === 4}
	<Step4ClinicalOutcome />
{:else if currentStep === 5}
	<Step5EQ5D5L />
{:else if currentStep === 6}
	<Step6GRC />
{:else if currentStep === 7}
	<Step7PROMIS />
{:else if currentStep === 8}
	<Step8FFT />
{:else if currentStep === 9}
	<Step9FollowupPlan />
{:else if currentStep === 10}
	<Step10SignOff />
{:else if currentStep === 11}
	<Step11ReviewSubmit />
{/if}

<StepNavigation
	isFirst={currentStep === 1}
	isLast={currentStep === TOTAL_STEPS}
	onPrev={goPrev}
	onNext={goNext}
	onSubmit={submitAssessment}
/>
