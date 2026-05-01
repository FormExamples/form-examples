<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import SectionCard from '$lib/components/ui/SectionCard.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';

	const r = assessment.data.referralTransport;
</script>

<SectionCard
	title="Referral & Transport"
	description="Where the patient is being sent, the ambulance service if available, and key times for the encounter."
>
	<h3 class="mb-2 text-base font-semibold text-gray-800">Referral facility</h3>
	<TextInput
		label="Name of facility"
		name="facilityName"
		bind:value={r.referralFacility.name}
		required
	/>
	<TextInput
		label="Focal point"
		name="facilityFocalPoint"
		bind:value={r.referralFacility.focalPoint}
	/>
	<TextInput
		label="Phone number"
		name="facilityPhone"
		type="tel"
		bind:value={r.referralFacility.phoneNumber}
	/>

	<h3 class="mt-6 mb-2 text-base font-semibold text-gray-800">
		Ambulance (if available)
	</h3>
	<TextInput
		label="Name of ambulance service"
		name="ambulanceName"
		bind:value={r.ambulance.name}
	/>
	<TextInput
		label="Focal point"
		name="ambulanceFocalPoint"
		bind:value={r.ambulance.focalPoint}
	/>
	<TextInput
		label="Phone number"
		name="ambulancePhone"
		type="tel"
		bind:value={r.ambulance.phoneNumber}
	/>

	<h3 class="mt-6 mb-2 text-base font-semibold text-gray-800">Key times</h3>
	<TextInput
		label="Date and time of event"
		name="eventDateTime"
		type="datetime-local"
		bind:value={r.eventDateTime}
		required
	/>
	<TextInput
		label="Date and time of departure from scene"
		name="departureDateTime"
		type="datetime-local"
		bind:value={r.departureDateTime}
		required
	/>
</SectionCard>
