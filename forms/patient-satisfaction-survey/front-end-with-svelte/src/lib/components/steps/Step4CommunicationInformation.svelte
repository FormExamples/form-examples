<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import LikertField from '#lib/components/ui/LikertField.svelte';

	const d = assessment.data.communicationInformation;
</script>

<Fieldset legend="Communication & Information">
	<p class="hint">How well did the team communicate with you?</p>

	<LikertField label="Explanation of your condition" name="explanationOfCondition" bind:value={d.explanationOfCondition} />
	<LikertField label="Explanation of your treatment options" name="explanationOfTreatment" bind:value={d.explanationOfTreatment} />
	<LikertField label="Opportunity to ask questions" name="opportunityToAskQuestions" bind:value={d.opportunityToAskQuestions} />
	<LikertField label="I felt listened to" name="listenedTo" bind:value={d.listenedTo} />
	<LikertField label="Information about your medication" name="informedAboutMedication" bind:value={d.informedAboutMedication} />
	<LikertField label="Quality of written information / leaflets" name="writtenInformationQuality" bind:value={d.writtenInformationQuality} />
</Fieldset>
