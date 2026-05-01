<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import SectionCard from '$lib/components/ui/SectionCard.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';

	const s = assessment.data.providerSignOff;
</script>

<SectionCard
	title="Referral Facility Provider Sign-off"
	description="The provider at the referral facility certifies the information on this counter-referral form."
>
	<TextInput
		label="Provider name"
		name="providerName"
		bind:value={s.providerName}
		required
	/>
	<TextInput
		label="Signature"
		name="providerSignature"
		bind:value={s.signature}
		placeholder="Type your full name to sign"
		required
	/>
	<TextInput
		label="Date"
		name="providerSignatureDate"
		type="date"
		bind:value={s.signatureDate}
		required
	/>

	<div class="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3 text-xs text-blue-900">
		Note: Attach a copy of the discharge medication chart or current medications list,
		including doses and time of last dose.
	</div>
</SectionCard>
