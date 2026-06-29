<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import LikertField from '$lib/components/ui/LikertField.svelte';

	const d = assessment.data.clinicalCareQuality;
</script>

<Fieldset legend="Clinical Care Quality">
	<p class="hint">How would you rate the clinical care you received?</p>

	<LikertField label="Confidence in your clinician" name="confidenceInClinician" bind:value={d.confidenceInClinician} />
	<LikertField label="Thoroughness of the examination" name="thoroughnessOfExamination" bind:value={d.thoroughnessOfExamination} />
	<LikertField label="Pain management" name="painManagement" bind:value={d.painManagement} />
	<LikertField label="Involvement in decisions about your care" name="involvementInDecisions" bind:value={d.involvementInDecisions} />
	<LikertField label="Privacy during examination" name="privacyDuringExamination" bind:value={d.privacyDuringExamination} />
	<LikertField label="Coordination of care between staff" name="coordinationOfCare" bind:value={d.coordinationOfCare} />
</Fieldset>
