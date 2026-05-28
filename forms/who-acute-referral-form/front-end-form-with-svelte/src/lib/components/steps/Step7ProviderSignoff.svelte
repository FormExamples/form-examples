<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';

	const s = assessment.data.initiatingProviderSignoff;
</script>

<Fieldset
	title="Initiating Facility Provider Sign-off"
	description="The provider at the initiating facility certifies the information on this form."
>
	<TextInput
		label="Provider name"
		name="initiatingProviderName"
		bind:value={s.providerName}
		required
	/>
	<TextInput
		label="Signature"
		name="initiatingProviderSignature"
		bind:value={s.signature}
		placeholder="Type your full name to sign"
		required
	/>
	<TextInput
		label="Date"
		name="initiatingProviderSignatureDate"
		type="date"
		bind:value={s.signatureDate}
		required
	/>

	<div class="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3 text-xs text-blue-900">
		Note: Attach a copy of the medication chart at discharge or a list of current
		medications, including dose and time of last dose.
	</div>
</Fieldset>
