<script lang="ts">
	import { goto } from '$app/navigation';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateFMS } from '$lib/engine/fms-grader';
	import { detectAdditionalFlags } from '$lib/engine/flagged-issues';

	import Form from '$lib/components/ui/Form.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	import Step1Demographics from '$lib/components/steps/Step1Demographics.svelte';
	import Step2ReferralInformation from '$lib/components/steps/Step2ReferralInformation.svelte';
	import Step3MovementHistory from '$lib/components/steps/Step3MovementHistory.svelte';
	import Step4DeepSquat from '$lib/components/steps/Step4DeepSquat.svelte';
	import Step5HurdleStep from '$lib/components/steps/Step5HurdleStep.svelte';
	import Step6InLineLunge from '$lib/components/steps/Step6InLineLunge.svelte';
	import Step7ShoulderMobility from '$lib/components/steps/Step7ShoulderMobility.svelte';
	import Step8ActiveStraightLegRaise from '$lib/components/steps/Step8ActiveStraightLegRaise.svelte';
	import Step9TrunkStabilityPushUp from '$lib/components/steps/Step9TrunkStabilityPushUp.svelte';
	import Step10RotaryStability from '$lib/components/steps/Step10RotaryStability.svelte';

	function submitAssessment() {
		const { fmsScore, fmsCategoryLabel, firedRules } = calculateFMS(assessment.data);
		const additionalFlags = detectAdditionalFlags(assessment.data);
		assessment.result = {
			fmsScore,
			fmsCategory: fmsCategoryLabel,
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

<Form label="Kinesiology Assessment" onsubmit={submitAssessment}>
	<Step1Demographics />
	<Step2ReferralInformation />
	<Step3MovementHistory />
	<Step4DeepSquat />
	<Step5HurdleStep />
	<Step6InLineLunge />
	<Step7ShoulderMobility />
	<Step8ActiveStraightLegRaise />
	<Step9TrunkStabilityPushUp />
	<Step10RotaryStability />

	<div class="button-group">
		<Button type="submit" data-variant="primary">Submit</Button>
		<Button data-variant="secondary" onclick={startOver}>Start over</Button>
	</div>
</Form>
