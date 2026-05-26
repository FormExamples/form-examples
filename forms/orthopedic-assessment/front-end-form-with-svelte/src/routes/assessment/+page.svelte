<script lang="ts">
	import { goto } from '$app/navigation';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateDASH } from '$lib/engine/dash-grader';
	import { detectAdditionalFlags } from '$lib/engine/flagged-issues';

	import Form from '$lib/components/ui/Form.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	import Step1Demographics from '$lib/components/steps/Step1Demographics.svelte';
	import Step2ChiefComplaint from '$lib/components/steps/Step2ChiefComplaint.svelte';
	import Step3PainAssessment from '$lib/components/steps/Step3PainAssessment.svelte';
	import Step4DASHQuestionnaire from '$lib/components/steps/Step4DASHQuestionnaire.svelte';
	import Step5RangeOfMotion from '$lib/components/steps/Step5RangeOfMotion.svelte';
	import Step6StrengthTesting from '$lib/components/steps/Step6StrengthTesting.svelte';
	import Step7FunctionalLimitations from '$lib/components/steps/Step7FunctionalLimitations.svelte';
	import Step8ImagingHistory from '$lib/components/steps/Step8ImagingHistory.svelte';
	import Step9CurrentTreatment from '$lib/components/steps/Step9CurrentTreatment.svelte';
	import Step10SurgicalHistory from '$lib/components/steps/Step10SurgicalHistory.svelte';

	function submitAssessment() {
		const { dashScore, dashCategoryLabel, firedRules } = calculateDASH(assessment.data);
		const additionalFlags = detectAdditionalFlags(assessment.data);
		assessment.result = {
			dashScore,
			dashCategory: dashCategoryLabel,
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

<Form label="Orthopedic Assessment" onsubmit={submitAssessment}>
	<Step1Demographics />
	<Step2ChiefComplaint />
	<Step3PainAssessment />
	<Step4DASHQuestionnaire />
	<Step5RangeOfMotion />
	<Step6StrengthTesting />
	<Step7FunctionalLimitations />
	<Step8ImagingHistory />
	<Step9CurrentTreatment />
	<Step10SurgicalHistory />

	<div class="button-group">
		<Button type="submit" data-variant="primary">Submit</Button>
		<Button data-variant="secondary" onclick={startOver}>Start over</Button>
	</div>
</Form>
