<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import LikertField from '#lib/components/ui/LikertField.svelte';

	const d = assessment.data.dischargeFollowUp;
</script>

<Fieldset legend="Discharge & Follow-up">
	<p class="hint">How was your discharge and follow-up handled?</p>

	<LikertField label="Discharge information provided" name="dischargeInformation" bind:value={d.dischargeInformation} />
	<LikertField label="Explanation of medication on discharge" name="medicationExplanation" bind:value={d.medicationExplanation} />
	<LikertField label="Follow-up arrangements" name="followUpArrangements" bind:value={d.followUpArrangements} />
	<LikertField label="I knew who to contact after discharge" name="knewWhoToContact" bind:value={d.knewWhoToContact} />
	<LikertField label="Information about recovery" name="recoveryInformation" bind:value={d.recoveryInformation} />
	<LikertField label="Clarity of the care plan" name="carePlanClarity" bind:value={d.carePlanClarity} />
</Fieldset>
