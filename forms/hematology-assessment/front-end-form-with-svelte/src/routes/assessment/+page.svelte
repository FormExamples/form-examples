<script lang="ts">
	import { goto } from '$app/navigation';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateAbnormality } from '$lib/engine/hematology-grader';
	import { detectAdditionalFlags } from '$lib/engine/flagged-issues';

	import Form from '$lib/components/ui/Form.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	import Step1PatientInformation from '$lib/components/steps/Step1PatientInformation.svelte';
	import Step2BloodCountAnalysis from '$lib/components/steps/Step2BloodCountAnalysis.svelte';
	import Step3CoagulationStudies from '$lib/components/steps/Step3CoagulationStudies.svelte';
	import Step4PeripheralBloodFilm from '$lib/components/steps/Step4PeripheralBloodFilm.svelte';
	import Step5IronStudies from '$lib/components/steps/Step5IronStudies.svelte';
	import Step6HemoglobinopathyScreening from '$lib/components/steps/Step6HemoglobinopathyScreening.svelte';
	import Step7BoneMarrowAssessment from '$lib/components/steps/Step7BoneMarrowAssessment.svelte';
	import Step8TransfusionHistory from '$lib/components/steps/Step8TransfusionHistory.svelte';
	import Step9TreatmentMedications from '$lib/components/steps/Step9TreatmentMedications.svelte';
	import Step10ClinicalReview from '$lib/components/steps/Step10ClinicalReview.svelte';

	function submitAssessment() {
		const { abnormalityLevel, abnormalityScore, firedRules } = calculateAbnormality(
			assessment.data
		);
		const additionalFlags = detectAdditionalFlags(assessment.data);
		assessment.result = {
			abnormalityLevel,
			abnormalityScore,
			firedRules,
			additionalFlags,
			timestamp: new Date().toISOString()
		};
		goto('/report');
	}

	function startOver() {
		assessment.reset();
		goto('/');
	}
</script>

<Form label="Hematology Assessment" onsubmit={submitAssessment}>
	<Step1PatientInformation />
	<Step2BloodCountAnalysis />
	<Step3CoagulationStudies />
	<Step4PeripheralBloodFilm />
	<Step5IronStudies />
	<Step6HemoglobinopathyScreening />
	<Step7BoneMarrowAssessment />
	<Step8TransfusionHistory />
	<Step9TreatmentMedications />
	<Step10ClinicalReview />

	<div class="button-group">
		<Button type="submit" data-variant="primary">Submit</Button>
		<Button data-variant="secondary" onclick={startOver}>Start over</Button>
	</div>
</Form>
