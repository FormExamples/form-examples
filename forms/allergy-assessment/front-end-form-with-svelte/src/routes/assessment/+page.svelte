<script lang="ts">
	import { goto } from '$app/navigation';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateAllergySeverity, calculateAllergyBurden } from '$lib/engine/allergy-grader';
	import { detectAdditionalFlags } from '$lib/engine/flagged-issues';

	import Form from '$lib/components/ui/Form.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	import Step1Demographics from '$lib/components/steps/Step1Demographics.svelte';
	import Step2AllergyHistory from '$lib/components/steps/Step2AllergyHistory.svelte';
	import Step3DrugAllergies from '$lib/components/steps/Step3DrugAllergies.svelte';
	import Step4FoodAllergies from '$lib/components/steps/Step4FoodAllergies.svelte';
	import Step5EnvironmentalAllergies from '$lib/components/steps/Step5EnvironmentalAllergies.svelte';
	import Step6AnaphylaxisHistory from '$lib/components/steps/Step6AnaphylaxisHistory.svelte';
	import Step7TestingResults from '$lib/components/steps/Step7TestingResults.svelte';
	import Step8CurrentManagement from '$lib/components/steps/Step8CurrentManagement.svelte';
	import Step9Comorbidities from '$lib/components/steps/Step9Comorbidities.svelte';
	import Step10ImpactActionPlan from '$lib/components/steps/Step10ImpactActionPlan.svelte';

	function submitAssessment() {
		const { severityLevel, firedRules } = calculateAllergySeverity(assessment.data);
		const allergyBurdenScore = calculateAllergyBurden(assessment.data);
		const additionalFlags = detectAdditionalFlags(assessment.data);
		assessment.result = {
			severityLevel,
			allergyBurdenScore,
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

<Form label="Allergy Assessment" onsubmit={submitAssessment}>
	<Step1Demographics />
	<Step2AllergyHistory />
	<Step3DrugAllergies />
	<Step4FoodAllergies />
	<Step5EnvironmentalAllergies />
	<Step6AnaphylaxisHistory />
	<Step7TestingResults />
	<Step8CurrentManagement />
	<Step9Comorbidities />
	<Step10ImpactActionPlan />

	<div class="button-group">
		<Button type="submit" data-variant="primary">Submit</Button>
		<Button data-variant="secondary" onclick={startOver}>Start over</Button>
	</div>
</Form>
