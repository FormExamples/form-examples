<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import Checkbox from '#lib/components/ui/Checkbox.svelte';

	const f = assessment.data.facilityAndTransport;

	const modeOptions = [
		{ value: 'ground', label: 'Ground (ambulance)' },
		{ value: 'air', label: 'Air' },
		{ value: 'sea', label: 'Sea' }
	];
</script>

<Fieldset
	title="Facility & Transport"
	description="Details of the initiating facility, the referral facility, the ambulance, and the timing and mode of transfer."
>
	<h3 class="mb-2 text-base font-semibold text-base-content">
		Initiating facility (refers patient for care)
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

	<TextAreaInput
		label="Reason for referral"
		name="reasonForReferral"
		bind:value={f.reasonForReferral}
		rows={3}
		required
	/>

	<Checkbox
		label="Referral facility has been contacted"
		name="referralFacilityContacted"
		bind:checked={f.referralFacilityContacted}
	/>

	<h3 class="mt-6 mb-2 text-base font-semibold text-base-content">
		Referral facility (receives patient & provides referral care)
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
	/>
	<TextInput
		label="Phone number"
		name="refFacilityPhone"
		type="tel"
		bind:value={f.referralFacility.phoneNumber}
		required
	/>

	<h3 class="mt-6 mb-2 text-base font-semibold text-base-content">Ambulance</h3>
	<TextInput label="Name / service" name="ambulanceName" bind:value={f.ambulance.name} />
	<TextInput
		label="Focal point (contact person)"
		name="ambulanceFocalPoint"
		bind:value={f.ambulance.focalPoint}
	/>
	<TextInput
		label="Phone number"
		name="ambulancePhone"
		type="tel"
		bind:value={f.ambulance.phoneNumber}
	/>

	<h3 class="mt-6 mb-2 text-base font-semibold text-base-content">Timing & mode</h3>
	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<TextInput
			label="Date & time of transfer decision"
			name="transferDecisionDateTime"
			type="datetime-local"
			bind:value={f.transferDecisionDateTime}
			required
		/>
		<TextInput
			label="Date & time of departure"
			name="departureDateTime"
			type="datetime-local"
			bind:value={f.departureDateTime}
			required
		/>
	</div>

	<RadioGroup
		label="Mode of transfer"
		name="modeOfTransfer"
		options={modeOptions}
		bind:value={f.modeOfTransfer}
		required
	/>
</Fieldset>
