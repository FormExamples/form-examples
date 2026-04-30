<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import SectionCard from '$lib/components/ui/SectionCard.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import Checkbox from '$lib/components/ui/Checkbox.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';

	const a = assessment.data.authorisation;

	const yesNoOptions = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];

	const contactOptions = [
		{ value: 'email', label: 'Email' },
		{ value: 'sms', label: 'SMS (Text)' }
	];
</script>

<SectionCard
	title="Applicant's Authorisation"
	description="Important information about fitness to drive and the medical-disclosure declaration."
>
	<div class="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900">
		<p class="mb-2">
			DVLA may require a medical examination and/or practical assessment. Individuals
			involved may include doctors, orthoptists at eye clinics, or paramedical staff at a
			driving assessment centre. Only fitness-to-drive-relevant medical information is
			shared. Relevant medical information may be considered by the Secretary of State's
			Honorary Medical Advisory Panels (confidential).
		</p>
	</div>

	<div class="mb-4 rounded-lg border border-gray-300 bg-gray-50 p-4 text-sm text-gray-800">
		<p class="mb-2 font-semibold">Declaration (must not be altered):</p>
		<ul class="list-disc space-y-1 pl-5">
			<li>
				I authorise my doctor, specialist, or healthcare professional to disclose medical
				information to DVLA on behalf of the Secretary of State for Transport.
			</li>
			<li>
				I understand this authorisation may be passed to another registered healthcare
				professional.
			</li>
			<li>
				I understand the Secretary of State may disclose information to doctors,
				orthoptists, paramedical staff, and Honorary Medical Advisory panel members.
			</li>
			<li>
				I declare the details I have given are correct to the best of my knowledge and
				belief.
			</li>
			<li>I acknowledge that making a false declaration is a criminal offence.</li>
		</ul>
	</div>

	<Checkbox
		label="I have read and agree to the declaration above."
		name="authDeclarationConfirmed"
		bind:checked={a.declarationConfirmed}
		required
	/>

	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<TextInput label="Name" name="authName" bind:value={a.name} required />
		<TextInput
			label="Date"
			name="authDate"
			type="date"
			bind:value={a.date}
			required
		/>
	</div>

	<TextInput
		label="Signature (type your full name)"
		name="authSignature"
		bind:value={a.signature}
		required
	/>

	<RadioGroup
		label="Do you authorise DVLA and the healthcare professionals involved to use email for correspondence about this declaration?"
		name="authElectronic"
		options={yesNoOptions}
		bind:value={a.authoriseElectronicCorrespondence}
		required
	/>

	<RadioGroup
		label="Preferred contact method from your healthcare professional (on behalf of DVLA)"
		name="contactHcp"
		options={contactOptions}
		bind:value={a.contactPreferenceFromHealthcareProfessional}
	/>

	<RadioGroup
		label="Preferred contact method from DVLA"
		name="contactDvla"
		options={contactOptions}
		bind:value={a.contactPreferenceFromDvla}
	/>
</SectionCard>
