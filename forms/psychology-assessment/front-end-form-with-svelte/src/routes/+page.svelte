<script lang="ts">
	import { goto } from '$app/navigation';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateDass21 } from '$lib/engine/dass21-grader';
	import { detectAdditionalFlags } from '$lib/engine/flagged-issues';

	import Form from '$lib/components/ui/Form.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';

	import Step1Demographics from '$lib/components/steps/Step1Demographics.svelte';
	import Step2ReasonForAssessment from '$lib/components/steps/Step2ReasonForAssessment.svelte';
	import Step3DassDepression from '$lib/components/steps/Step3DassDepression.svelte';
	import Step4DassAnxiety from '$lib/components/steps/Step4DassAnxiety.svelte';
	import Step5DassStress from '$lib/components/steps/Step5DassStress.svelte';
	import Step6FunctionalImpact from '$lib/components/steps/Step6FunctionalImpact.svelte';
	import Step7RiskScreen from '$lib/components/steps/Step7RiskScreen.svelte';
	import Step8SupportAndHistory from '$lib/components/steps/Step8SupportAndHistory.svelte';

	function submitAssessment() {
		const { depression, anxiety, stress, firedRules } = calculateDass21(assessment.data);
		const additionalFlags = detectAdditionalFlags(assessment.data, depression, anxiety, stress);
		assessment.result = {
			depression,
			anxiety,
			stress,
			firedRules,
			additionalFlags,
			timestamp: new Date().toISOString()
		};
		goto('/report');
	}

	function startOver() {
		assessment.reset();
	}
</script>

<div class="min-h-screen bg-gray-50">
	<header class="border-b border-gray-200 bg-white shadow-sm no-print">
		<div class="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
			<h1 class="text-lg font-bold text-gray-900">Psychology Assessment (DASS-21)</h1>
			<Button onclick={startOver}>Start over</Button>
		</div>
	</header>

	<main class="mx-auto max-w-3xl px-4 py-6">
		<Alert type="info">
			This single-page questionnaire collects your demographics, the DASS-21 (a validated screen of depression, anxiety, and stress), and a brief safety screen. It takes about 10 minutes. Your responses generate a clinical report; if any urgent concerns are flagged, your clinician will be alerted.
		</Alert>

		<Form label="Psychology Assessment" onsubmit={submitAssessment}>
			<Step1Demographics />
			<Step2ReasonForAssessment />
			<Step3DassDepression />
			<Step4DassAnxiety />
			<Step5DassStress />
			<Step6FunctionalImpact />
			<Step7RiskScreen />
			<Step8SupportAndHistory />

			<div class="button-group">
				<Button type="submit" data-variant="primary">Submit Assessment</Button>
			</div>
		</Form>
	</main>
</div>
