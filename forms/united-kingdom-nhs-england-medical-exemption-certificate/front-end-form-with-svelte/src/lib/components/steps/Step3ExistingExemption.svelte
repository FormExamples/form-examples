<script lang="ts">
	import { application } from '$lib/stores/application.svelte';
	import SectionCard from '$lib/components/ui/SectionCard.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';

	const e = application.data.existingExemption;

	const yesNoOptions = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];

	const applicationKindOptions = [
		{ value: 'new', label: 'New' },
		{ value: 'renewal', label: 'Renewal' },
		{ value: 'replacement', label: 'Replacement (lost / damaged)' }
	];
</script>

<SectionCard
	title="Existing exemption check"
	description="Does the patient already hold a valid medical exemption certificate? Renewals should be timed within the NHSBSA renewal window."
>
	<RadioGroup
		label="Does the patient already hold a valid medical exemption certificate?"
		name="hasExistingCertificate"
		options={yesNoOptions}
		bind:value={e.hasExistingCertificate}
		required
	/>

	{#if e.hasExistingCertificate === 'yes'}
		<RadioGroup
			label="Application kind"
			name="applicationKind"
			options={applicationKindOptions}
			bind:value={e.applicationKind}
			required
		/>

		<TextInput
			label="Previous certificate number"
			name="previousCertificateNumber"
			bind:value={e.previousCertificateNumber}
			placeholder="As printed on the existing certificate"
		/>

		<TextInput
			label="Previous certificate expiry date"
			name="previousCertificateExpiryDate"
			type="date"
			bind:value={e.previousCertificateExpiryDate}
		/>
	{/if}
</SectionCard>
