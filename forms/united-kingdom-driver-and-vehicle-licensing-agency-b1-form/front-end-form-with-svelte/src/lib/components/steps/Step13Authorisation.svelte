<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import SectionCard from '$lib/components/ui/SectionCard.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import Checkbox from '$lib/components/ui/Checkbox.svelte';

	const a = assessment.data.authorisation;

	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];

	const channelOptions = [
		{ value: 'email', label: 'Email' },
		{ value: 'sms', label: 'SMS (Text)' }
	];
</script>

<SectionCard
	title="Applicant's authorisation"
	description="Please read the declaration carefully before signing."
>
	<div class="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-800">
		<p class="mb-2">
			I authorise my doctor(s) and other healthcare professionals who have or have had
			involvement in my care to release reports and medical information about me to
			medical advisers at the DVLA, and I authorise the DVLA's medical advisers to share
			relevant information with my doctor(s).
		</p>
		<p>
			I declare that the information I have given is true and complete to the best of my
			knowledge and belief. I understand that it is a criminal offence to make a false
			declaration to obtain a driving licence.
		</p>
	</div>

	<Checkbox
		label="I have read and accept the declaration above."
		name="declarationAccepted"
		bind:checked={a.declarationAccepted}
	/>

	<TextInput label="Name" name="authName" bind:value={a.name} required />
	<TextInput
		label="Date"
		name="authDate"
		type="date"
		bind:value={a.signatureDate}
		required
	/>

	<h3 class="mt-6 mb-2 text-base font-semibold text-gray-800">Correspondence</h3>
	<RadioGroup
		label="Do you consent to electronic correspondence (email)?"
		name="electronicCorrespondenceConsent"
		options={yesNo}
		bind:value={a.electronicCorrespondenceConsent}
		required
	/>

	{#if a.electronicCorrespondenceConsent === 'yes'}
		<RadioGroup
			label="Contact preference from DVLA"
			name="dvlaContactPreference"
			options={channelOptions}
			bind:value={a.dvlaContactPreference}
			required
		/>
		<RadioGroup
			label="Contact preference from a healthcare professional on behalf of DVLA"
			name="healthcareContactPreference"
			options={channelOptions}
			bind:value={a.healthcareContactPreference}
			required
		/>
	{/if}
</SectionCard>
