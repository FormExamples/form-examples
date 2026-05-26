<script lang="ts">
	import { goto } from '$app/navigation';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateCompleteness } from '$lib/engine/completeness-grader';

	import Form from '$lib/components/ui/Form.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	import Step1PersonalInformation from '$lib/components/steps/Step1PersonalInformation.svelte';
	import Step2StatementContext from '$lib/components/steps/Step2StatementContext.svelte';
	import Step3ValuesBeliefs from '$lib/components/steps/Step3ValuesBeliefs.svelte';
	import Step4CarePreferences from '$lib/components/steps/Step4CarePreferences.svelte';
	import Step5MedicalTreatmentWishes from '$lib/components/steps/Step5MedicalTreatmentWishes.svelte';
	import Step6CommunicationPreferences from '$lib/components/steps/Step6CommunicationPreferences.svelte';
	import Step7PeopleImportantToMe from '$lib/components/steps/Step7PeopleImportantToMe.svelte';
	import Step8PracticalMatters from '$lib/components/steps/Step8PracticalMatters.svelte';
	import Step9SignaturesWitnesses from '$lib/components/steps/Step9SignaturesWitnesses.svelte';

	function submitStatement() {
		const result = calculateCompleteness(assessment.data);
		assessment.result = result;
		goto('/report');
	}

	function startOver() {
		assessment.reset();
		goto('/');
	}
</script>

<Form label="Advance Statement About Care" onsubmit={submitStatement}>
	<Step1PersonalInformation />
	<Step2StatementContext />
	<Step3ValuesBeliefs />
	<Step4CarePreferences />
	<Step5MedicalTreatmentWishes />
	<Step6CommunicationPreferences />
	<Step7PeopleImportantToMe />
	<Step8PracticalMatters />
	<Step9SignaturesWitnesses />

	<div class="button-group">
		<Button type="submit" data-variant="primary">Submit</Button>
		<Button data-variant="secondary" onclick={startOver}>Start over</Button>
	</div>
</Form>
