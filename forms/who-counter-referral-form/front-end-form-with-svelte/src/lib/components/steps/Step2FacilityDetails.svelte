<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import Checkbox from '$lib/components/ui/Checkbox.svelte';

	const f = assessment.data.facilityDetails;

	const acuityOptions = [
		{ value: 'acute', label: 'Acute' },
		{ value: 'non-acute', label: 'Non-acute' }
	];

	const followUpOptions = [
		{ value: 'urgent-within-24-hours', label: 'Urgent (within 24 hours)' },
		{ value: '2-to-6-days', label: '2–6 days' },
		{ value: '1-to-2-weeks', label: '1–2 weeks' },
		{ value: 'more-than-2-weeks', label: '> 2 weeks' }
	];
</script>

<Fieldset
	title="Facility Details"
	description="Initiating facility, referral facility, primary care facility, communication, and follow-up timeframe."
>
	<h3 class="mb-2 text-base font-semibold text-gray-800">
		Initiating facility (originally referred patient)
	</h3>
	<TextInput
		label="Name"
		name="initFacilityName"
		bind:value={f.initiatingFacility.name}
		required
	/>
	<TextInput
		label="Focal point (contact person)"
		name="initFacilityFocalPoint"
		bind:value={f.initiatingFacility.focalPoint}
		required
	/>
	<TextInput
		label="Phone number"
		name="initFacilityPhone"
		type="tel"
		bind:value={f.initiatingFacility.phoneNumber}
		required
	/>

	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<TextInput
			label="Date of original referral"
			name="referralDate"
			type="date"
			bind:value={f.referralDate}
			required
		/>
	</div>

	<TextAreaInput
		label="Reason for original referral"
		name="referralReason"
		bind:value={f.referralReason}
		rows={3}
		required
	/>

	<RadioGroup
		label="Acuity"
		name="acuity"
		options={acuityOptions}
		bind:value={f.acuity}
		required
	/>

	<h3 class="mt-6 mb-2 text-base font-semibold text-gray-800">
		Referral facility (treated and now discharging patient)
	</h3>
	<TextInput
		label="Name"
		name="refFacilityName"
		bind:value={f.referralFacility.name}
		required
	/>
	<TextInput
		label="Focal point (contact person)"
		name="refFacilityFocalPoint"
		bind:value={f.referralFacility.focalPoint}
		required
	/>
	<TextInput
		label="Phone number"
		name="refFacilityPhone"
		type="tel"
		bind:value={f.referralFacility.phoneNumber}
		required
	/>

	<h3 class="mt-6 mb-2 text-base font-semibold text-gray-800">Communication</h3>
	<p class="mb-3 text-xs text-gray-500">
		Tick at least one. Confirm that follow-up arrangements have been discussed.
	</p>
	<Checkbox
		label="Discussed with primary care provider"
		name="discussedWithPrimaryCareProvider"
		bind:checked={f.communication.discussedWithPrimaryCareProvider}
	/>
	<Checkbox
		label="Discussed with initiating facility"
		name="discussedWithInitiatingFacility"
		bind:checked={f.communication.discussedWithInitiatingFacility}
	/>

	<h3 class="mt-6 mb-2 text-base font-semibold text-gray-800">
		Primary care facility (ongoing care)
	</h3>
	<TextInput
		label="Name"
		name="pcFacilityName"
		bind:value={f.primaryCareFacility.name}
	/>
	<TextInput
		label="Focal point (contact person)"
		name="pcFacilityFocalPoint"
		bind:value={f.primaryCareFacility.focalPoint}
	/>
	<TextInput
		label="Phone number"
		name="pcFacilityPhone"
		type="tel"
		bind:value={f.primaryCareFacility.phoneNumber}
	/>

	<RadioGroup
		label="Time frame for primary care follow-up with patient"
		name="followUpTimeframe"
		options={followUpOptions}
		bind:value={f.followUpTimeframe}
		required
	/>
</Fieldset>
