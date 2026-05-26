<script lang="ts">
	import { goto } from '$app/navigation';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateCardioGrade } from '$lib/engine/cardio-grader';

	import Form from '$lib/components/ui/Form.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	import Step1Demographics from '$lib/components/steps/Step1Demographics.svelte';
	import Step2ChestPainAngina from '$lib/components/steps/Step2ChestPainAngina.svelte';
	import Step3HeartFailureSymptoms from '$lib/components/steps/Step3HeartFailureSymptoms.svelte';
	import Step4CardiacHistory from '$lib/components/steps/Step4CardiacHistory.svelte';
	import Step5ArrhythmiaConduction from '$lib/components/steps/Step5ArrhythmiaConduction.svelte';
	import Step6RiskFactors from '$lib/components/steps/Step6RiskFactors.svelte';
	import Step7DiagnosticResults from '$lib/components/steps/Step7DiagnosticResults.svelte';
	import Step8CurrentMedications from '$lib/components/steps/Step8CurrentMedications.svelte';
	import Step9Allergies from '$lib/components/steps/Step9Allergies.svelte';
	import Step10SocialFunctional from '$lib/components/steps/Step10SocialFunctional.svelte';

	function submitAssessment() {
		const result = calculateCardioGrade(assessment.data);
		assessment.result = result;
		goto('/report');
	}

	function startOver() {
		assessment.reset();
		goto('/');
	}
</script>

<Form label="Cardiology Assessment" onsubmit={submitAssessment}>
	<Step1Demographics />
	<Step2ChestPainAngina />
	<Step3HeartFailureSymptoms />
	<Step4CardiacHistory />
	<Step5ArrhythmiaConduction />
	<Step6RiskFactors />
	<Step7DiagnosticResults />
	<Step8CurrentMedications />
	<Step9Allergies />
	<Step10SocialFunctional />

	<div class="button-group">
		<Button type="submit" data-variant="primary">Submit</Button>
		<Button data-variant="secondary" onclick={startOver}>Start over</Button>
	</div>
</Form>
