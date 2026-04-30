<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import SectionCard from '$lib/components/ui/SectionCard.svelte';
	import YesNoQuestion from '$lib/components/ui/YesNoQuestion.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';

	const a = assessment.data.authorisation;

	const contactPreferenceOptions = [
		{ value: 'email', label: 'Email' },
		{ value: 'sms', label: 'SMS (Text)' }
	];
</script>

<SectionCard
	title="Applicant's Authorisation"
	description="Declaration authorising medical disclosure and contact preferences"
>
	<div class="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-800">
		I authorise the release of medical reports and information to the Drivers
		Medical Group, DVLA, by my doctor(s) or those mentioned on this form, in
		strict confidence, to enable the DVLA to assess my fitness to drive. I
		understand that making a false declaration to obtain a driving licence is a
		criminal offence under section 174 of the Road Traffic Act 1988.
	</div>

	<YesNoQuestion
		label="I confirm the declaration above"
		name="declarationConfirmed"
		bind:value={a.declarationConfirmed}
		required
	/>

	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<TextInput
			label="Name (printed)"
			name="signatoryName"
			bind:value={a.signatoryName}
			required
		/>
		<TextInput
			label="Signature (typed)"
			name="signatureText"
			bind:value={a.signatureText}
		/>
	</div>

	<TextInput
		label="Date"
		name="signatureDate"
		type="date"
		bind:value={a.signatureDate}
		required
	/>

	<hr class="my-6 border-gray-200" />

	<YesNoQuestion
		label="Do you consent to electronic correspondence (email) from the DVLA?"
		name="electronicCorrespondenceConsent"
		bind:value={a.electronicCorrespondenceConsent}
	/>

	<RadioGroup
		label="Preferred contact method from the DVLA"
		name="dvlaContactPreference"
		options={contactPreferenceOptions}
		bind:value={a.dvlaContactPreference}
	/>

	<RadioGroup
		label="Preferred contact method from your healthcare professional on behalf of the DVLA"
		name="healthcareProfessionalContactPreference"
		options={contactPreferenceOptions}
		bind:value={a.healthcareProfessionalContactPreference}
	/>
</SectionCard>
