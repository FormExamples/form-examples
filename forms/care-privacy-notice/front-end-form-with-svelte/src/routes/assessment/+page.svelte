<script lang="ts">
	import { goto } from '$app/navigation';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { validateForm } from '$lib/engine/form-validator';
	import { detectAdditionalFlags } from '$lib/engine/flagged-issues';

	import Form from '$lib/components/ui/Form.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	import Step1PracticeConfiguration from '$lib/components/steps/Step1PracticeConfiguration.svelte';
	import Step2PrivacyNotice from '$lib/components/steps/Step2PrivacyNotice.svelte';
	import Step3AcknowledgmentSignature from '$lib/components/steps/Step3AcknowledgmentSignature.svelte';

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
</script>

<Form label="Care Privacy Notice" onsubmit={submitAssessment}>
	<Step1PracticeConfiguration />
	<Step2PrivacyNotice />
	<Step3AcknowledgmentSignature />

	<div class="button-group">
		<Button type="submit" data-variant="primary">Submit</Button>
	</div>
</Form>
