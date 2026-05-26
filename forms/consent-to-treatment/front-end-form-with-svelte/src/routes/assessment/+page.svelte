<script lang="ts">
	import { goto } from '$app/navigation';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { validateForm } from '$lib/engine/form-validator';
	import { detectAdditionalFlags } from '$lib/engine/flagged-issues';

	import Form from '$lib/components/ui/Form.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	import Step1PatientInformation from '$lib/components/steps/Step1PatientInformation.svelte';
	import Step2ProcedureDetails from '$lib/components/steps/Step2ProcedureDetails.svelte';
	import Step3RisksBenefits from '$lib/components/steps/Step3RisksBenefits.svelte';
	import Step4AlternativeTreatments from '$lib/components/steps/Step4AlternativeTreatments.svelte';
	import Step5AnesthesiaInformation from '$lib/components/steps/Step5AnesthesiaInformation.svelte';
	import Step6QuestionsUnderstanding from '$lib/components/steps/Step6QuestionsUnderstanding.svelte';
	import Step7PatientRights from '$lib/components/steps/Step7PatientRights.svelte';
	import Step8SignatureConsent from '$lib/components/steps/Step8SignatureConsent.svelte';

	function submitAssessment() {
		const { completeness, status, firedRules } = validateForm(assessment.data);
		const additionalFlags = detectAdditionalFlags(assessment.data);
		assessment.result = {
			completenessPercent: completeness,
			status,
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

<Form label="Consent to Treatment" onsubmit={submitAssessment}>
	<Step1PatientInformation />
	<Step2ProcedureDetails />
	<Step3RisksBenefits />
	<Step4AlternativeTreatments />
	<Step5AnesthesiaInformation />
	<Step6QuestionsUnderstanding />
	<Step7PatientRights />
	<Step8SignatureConsent />

	<div class="button-group">
		<Button type="submit" data-variant="primary">Submit</Button>
		<Button data-variant="secondary" onclick={startOver}>Start over</Button>
	</div>
</Form>
