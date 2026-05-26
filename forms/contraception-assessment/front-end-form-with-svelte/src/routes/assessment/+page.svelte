<script lang="ts">
	import { goto } from '$app/navigation';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { evaluateUKMEC } from '$lib/engine/ukmec-grader';
	import { detectAdditionalFlags } from '$lib/engine/flagged-issues';

	import Form from '$lib/components/ui/Form.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	import Step1Demographics from '$lib/components/steps/Step1Demographics.svelte';
	import Step2ReproductiveHistory from '$lib/components/steps/Step2ReproductiveHistory.svelte';
	import Step3MenstrualHistory from '$lib/components/steps/Step3MenstrualHistory.svelte';
	import Step4CurrentContraception from '$lib/components/steps/Step4CurrentContraception.svelte';
	import Step5MedicalHistory from '$lib/components/steps/Step5MedicalHistory.svelte';
	import Step6CardiovascularRisk from '$lib/components/steps/Step6CardiovascularRisk.svelte';
	import Step7LifestyleFactors from '$lib/components/steps/Step7LifestyleFactors.svelte';
	import Step8PreferencesPriorities from '$lib/components/steps/Step8PreferencesPriorities.svelte';
	import Step9BreastCervicalScreening from '$lib/components/steps/Step9BreastCervicalScreening.svelte';
	import Step10FamilyPlanningGoals from '$lib/components/steps/Step10FamilyPlanningGoals.svelte';

	function submitAssessment() {
		const { ukmecResults, firedRules } = evaluateUKMEC(assessment.data);
		const additionalFlags = detectAdditionalFlags(assessment.data, ukmecResults);

		const overallHighest = Math.max(...ukmecResults.map((r) => r.category)) as 1 | 2 | 3 | 4;

		const preferredMethod = assessment.data.preferencesPriorities.preferredMethod;
		const preferredResult = preferredMethod
			? ukmecResults.find((r) => r.method === preferredMethod)
			: null;

		assessment.result = {
			ukmecResults,
			overallHighestCategory: overallHighest,
			preferredMethodCategory: preferredResult ? preferredResult.category : null,
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

<Form label="Contraception Assessment" onsubmit={submitAssessment}>
	<Step1Demographics />
	<Step2ReproductiveHistory />
	<Step3MenstrualHistory />
	<Step4CurrentContraception />
	<Step5MedicalHistory />
	<Step6CardiovascularRisk />
	<Step7LifestyleFactors />
	<Step8PreferencesPriorities />
	<Step9BreastCervicalScreening />
	<Step10FamilyPlanningGoals />

	<div class="button-group">
		<Button type="submit" data-variant="primary">Submit</Button>
		<Button data-variant="secondary" onclick={startOver}>Start over</Button>
	</div>
</Form>
