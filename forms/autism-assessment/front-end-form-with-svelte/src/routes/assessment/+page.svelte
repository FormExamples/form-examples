<script lang="ts">
	import { goto } from '$app/navigation';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateAQ10 } from '$lib/engine/aq10-grader';
	import { detectAdditionalFlags } from '$lib/engine/flagged-issues';

	import Form from '$lib/components/ui/Form.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	import Step1Demographics from '$lib/components/steps/Step1Demographics.svelte';
	import Step2ScreeningPurpose from '$lib/components/steps/Step2ScreeningPurpose.svelte';
	import Step3AQ10Questionnaire from '$lib/components/steps/Step3AQ10Questionnaire.svelte';
	import Step4SocialCommunication from '$lib/components/steps/Step4SocialCommunication.svelte';
	import Step5RepetitiveBehaviors from '$lib/components/steps/Step5RepetitiveBehaviors.svelte';
	import Step6SensoryProfile from '$lib/components/steps/Step6SensoryProfile.svelte';
	import Step7DevelopmentalHistory from '$lib/components/steps/Step7DevelopmentalHistory.svelte';
	import Step8CurrentSupport from '$lib/components/steps/Step8CurrentSupport.svelte';
	import Step9FamilyHistory from '$lib/components/steps/Step9FamilyHistory.svelte';

	function submitAssessment() {
		const { aq10Score, aq10CategoryLabel, firedRules } = calculateAQ10(assessment.data);
		const additionalFlags = detectAdditionalFlags(assessment.data);
		assessment.result = {
			aq10Score,
			aq10Category: aq10CategoryLabel,
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

<Form label="Autism Assessment" onsubmit={submitAssessment}>
	<Step1Demographics />
	<Step2ScreeningPurpose />
	<Step3AQ10Questionnaire />
	<Step4SocialCommunication />
	<Step5RepetitiveBehaviors />
	<Step6SensoryProfile />
	<Step7DevelopmentalHistory />
	<Step8CurrentSupport />
	<Step9FamilyHistory />

	<div class="button-group">
		<Button type="submit" data-variant="primary">Submit</Button>
		<Button data-variant="secondary" onclick={startOver}>Start over</Button>
	</div>
</Form>
