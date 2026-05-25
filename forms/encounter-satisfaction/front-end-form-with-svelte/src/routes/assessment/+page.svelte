<script lang="ts">
	import { goto } from '$app/navigation';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateSatisfaction } from '$lib/engine/satisfaction-grader';
	import { detectAdditionalFlags } from '$lib/engine/flagged-issues';

	import Form from '$lib/components/ui/Form.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	import Step1Demographics from '$lib/components/steps/Step1Demographics.svelte';
	import Step2VisitInformation from '$lib/components/steps/Step2VisitInformation.svelte';
	import Step3AccessScheduling from '$lib/components/steps/Step3AccessScheduling.svelte';
	import Step4Communication from '$lib/components/steps/Step4Communication.svelte';
	import Step5StaffProfessionalism from '$lib/components/steps/Step5StaffProfessionalism.svelte';
	import Step6CareQuality from '$lib/components/steps/Step6CareQuality.svelte';
	import Step7Environment from '$lib/components/steps/Step7Environment.svelte';
	import Step8OverallSatisfaction from '$lib/components/steps/Step8OverallSatisfaction.svelte';

	function submitSurvey() {
		const { compositeScore, category, domainScores, answeredCount } = calculateSatisfaction(
			assessment.data
		);
		const additionalFlags = detectAdditionalFlags(assessment.data, compositeScore);
		assessment.result = {
			compositeScore,
			category,
			domainScores,
			additionalFlags,
			answeredCount,
			timestamp: new Date().toISOString()
		};
		goto('/report');
	}

	function startOver() {
		assessment.reset();
		goto('/');
	}
</script>

<Form label="Encounter Satisfaction Survey" onsubmit={submitSurvey}>
	<Step1Demographics />
	<Step2VisitInformation />
	<Step3AccessScheduling />
	<Step4Communication />
	<Step5StaffProfessionalism />
	<Step6CareQuality />
	<Step7Environment />
	<Step8OverallSatisfaction />

	<div class="button-group">
		<Button type="submit" data-variant="primary">Submit</Button>
		<Button data-variant="secondary" onclick={startOver}>Start over</Button>
	</div>
</Form>
