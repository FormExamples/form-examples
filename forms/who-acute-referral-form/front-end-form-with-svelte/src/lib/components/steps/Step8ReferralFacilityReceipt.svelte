<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import SectionCard from '$lib/components/ui/SectionCard.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import Checkbox from '$lib/components/ui/Checkbox.svelte';

	const r = assessment.data.referralFacilityReceipt;
</script>

<SectionCard
	title="Referral Facility Receipt"
	description="To be completed by the receiving (referral) facility upon arrival of the patient."
>
	<TextInput
		label="Date & time of patient arrival"
		name="patientArrivalDateTime"
		type="datetime-local"
		bind:value={r.patientArrivalDateTime}
	/>

	<TextInput
		label="Receiving provider name"
		name="receivingProviderName"
		bind:value={r.receivingProviderName}
	/>
	<TextInput
		label="Receiving provider signature"
		name="receivingProviderSignature"
		bind:value={r.receivingProviderSignature}
		placeholder="Type your full name to sign"
	/>

	<Checkbox
		label="Feedback provided to initiating facility"
		name="feedbackProvidedToInitiatingFacility"
		bind:checked={r.feedbackProvidedToInitiatingFacility}
	/>
</SectionCard>
